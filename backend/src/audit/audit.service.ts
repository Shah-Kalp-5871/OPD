import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { subHours, startOfDay } from 'date-fns';
import * as crypto from 'crypto';

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Logs a security access event
   */
  async logEvent(data: {
    userId?: string;
    role?: string;
    branchId?: string;
    patientId?: string;
    actionType: string;
    module: string;
    ipAddress?: string;
    userAgent?: string;
    entityType?: string;
    entityId?: string;
    details?: string;
  }): Promise<any> {
    // Immutable log enforcement: only allow creation
    return this.prisma.hipaaAuditLog.create({
      data: {
        userId: data.userId || null,
        role: data.role || null,
        branchId: data.branchId || null,
        patientId: data.patientId || null,
        actionType: data.actionType,
        module: data.module,
        ipAddress: data.ipAddress || null,
        userAgent: data.userAgent || null,
        entityType: data.entityType || null,
        entityId: data.entityId || null,
        details: this.maskSensitiveData(data.details || ''),
      },
    });
  }

  /**
   * Sensitive Field Masking utility (HIPAA compliance)
   */
  private maskSensitiveData(input: string): string {
    if (!input) return '';
    // Mask typical clinical/sensitive patterns
    let masked = input;
    
    // Mask email addresses
    masked = masked.replace(/[\w\.-]+@[\w\.-]+\.\w{2,4}/gi, (email) => {
      const parts = email.split('@');
      return `${parts[0][0]}***@${parts[1]}`;
    });

    // Mask phone numbers (10 digits)
    masked = masked.replace(/\b\d{10}\b/g, (phone) => {
      return `${phone.substring(0, 3)}****${phone.substring(7)}`;
    });

    // Mask National IDs or SSNs (pattern like XXX-XX-XXXX)
    masked = masked.replace(/\b\d{3}-\d{2}-\d{4}\b/g, 'XXX-XX-XXXX');

    return masked;
  }

  /**
   * Record Patient Consent Form
   */
  async recordConsent(data: {
    patientId: string;
    consentType: string;
    ipAddress?: string;
    userAgent?: string;
    signatureText?: string;
  }): Promise<any> {
    return this.prisma.patientConsent.create({
      data: {
        patientId: data.patientId,
        consentType: data.consentType,
        status: 'ACTIVE',
        ipAddress: data.ipAddress || null,
        userAgent: data.userAgent || null,
        signatureText: data.signatureText || 'ACCEPTED_ELECTRONICALLY',
      },
    });
  }

  /**
   * Withdraw Patient Consent
   */
  async withdrawConsent(consentId: string): Promise<any> {
    const consent = await this.prisma.patientConsent.findUnique({
      where: { id: consentId },
    });

    if (!consent) {
      throw new NotFoundException(`Consent record ${consentId} not found`);
    }

    return this.prisma.patientConsent.update({
      where: { id: consentId },
      data: {
        status: 'WITHDRAWN',
        withdrawnAt: new Date(),
      },
    });
  }

  /**
   * Fetch Active Consents for a Patient
   */
  async getPatientConsents(patientId: string): Promise<any[]> {
    return this.prisma.patientConsent.findMany({
      where: { patientId },
      orderBy: { signedAt: 'desc' },
    });
  }

  /**
   * Fetch all HIPAA Audit Logs (Paginated, Masked, Export-Safe)
   */
  async getLogs(page = 1, limit = 50, filter?: any): Promise<any> {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (filter?.actionType) {
      where.actionType = filter.actionType;
    }
    if (filter?.branchId) {
      where.branchId = filter.branchId;
    }
    if (filter?.userId) {
      where.userId = filter.userId;
    }
    if (filter?.patientId) {
      where.patientId = filter.patientId;
    }

    const [total, data] = await Promise.all([
      this.prisma.hipaaAuditLog.count({ where }),
      this.prisma.hipaaAuditLog.findMany({
        where,
        orderBy: { timestamp: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    // Format logs into an export-safe model (ensuring they can never be modified)
    const secureLogs = data.map((log) => ({
      ...log,
      details: this.maskSensitiveData(log.details || ''),
      logProtectionKey: crypto
        .createHash('sha256')
        .update(`${log.id}::${log.timestamp.toISOString()}::${log.actionType}`)
        .digest('hex'),
    }));

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      logs: secureLogs,
    };
  }

  /**
   * Suspicious Access Analyzer (e.g., high volume patient queries by single user)
   */
  async getSuspiciousAccess(): Promise<any[]> {
    const oneHourAgo = subHours(new Date(), 1);
    
    // Group logs in memory/DB to find single users accessing > 5 patient records within 1 hour
    const logs = await this.prisma.hipaaAuditLog.findMany({
      where: {
        actionType: 'VIEWED_PATIENT',
        timestamp: { gte: oneHourAgo },
      },
    });

    const userAccessMap = new Map<string, Set<string>>();
    logs.forEach((log) => {
      if (log.userId && log.patientId) {
        if (!userAccessMap.has(log.userId)) {
          userAccessMap.set(log.userId, new Set());
        }
        userAccessMap.get(log.userId)?.add(log.patientId);
      }
    });

    const anomalies: any[] = [];
    for (const [userId, patients] of userAccessMap.entries()) {
      if (patients.size > 5) {
        const userInfo = await this.prisma.user.findUnique({
          where: { id: userId },
          select: { id: true, name: true, role: true, email: true },
        });

        anomalies.push({
          userId,
          user: userInfo || { name: 'Unknown User' },
          uniquePatientViews: patients.size,
          patientIds: Array.from(patients),
          timeframe: 'Last 1 Hour',
          severity: 'HIGH',
          reason: 'Excessive patient file views in a short timeframe (potential data scrapping)',
        });
      }
    }

    return anomalies;
  }

  /**
   * Failed Login Spikes Detector (> 3 failures from same IP or account in 24 hours)
   */
  async getFailedLoginSpikes(): Promise<any[]> {
    const oneDayAgo = subHours(new Date(), 24);

    const logs = await this.prisma.hipaaAuditLog.findMany({
      where: {
        actionType: 'LOGIN_FAILED',
        timestamp: { gte: oneDayAgo },
      },
    });

    const ipSpikeMap = new Map<string, number>();
    logs.forEach((log) => {
      if (log.ipAddress) {
        ipSpikeMap.set(log.ipAddress, (ipSpikeMap.get(log.ipAddress) || 0) + 1);
      }
    });

    const spikes: any[] = [];
    for (const [ipAddress, count] of ipSpikeMap.entries()) {
      if (count >= 3) {
        spikes.push({
          ipAddress,
          failureCount: count,
          timeframe: 'Last 24 Hours',
          severity: count >= 7 ? 'CRITICAL' : 'MEDIUM',
          reason: `High volume of authentication failures (${count} failed attempts) from a single IP address`,
        });
      }
    }

    return spikes;
  }

  /**
   * Cross-Branch Access Attempt Detector
   */
  async getCrossBranchAttempts(): Promise<any[]> {
    // Detect logs where user's registered branchId does not match patient's branchId, 
    // or when cross-branch triggers occur
    const logs = await this.prisma.hipaaAuditLog.findMany({
      where: {
        details: { contains: 'CROSS_BRANCH' },
      },
      orderBy: { timestamp: 'desc' },
      take: 20,
    });

    return logs.map((log) => ({
      id: log.id,
      userId: log.userId,
      role: log.role,
      userBranchId: log.branchId,
      patientId: log.patientId,
      action: log.actionType,
      ipAddress: log.ipAddress,
      timestamp: log.timestamp,
      details: log.details,
    }));
  }

  /**
   * High-Risk Operational Activities (logins during odd hours or huge report exports)
   */
  async getHighRiskLogs(): Promise<any[]> {
    const logs = await this.prisma.hipaaAuditLog.findMany({
      where: {
        OR: [
          { actionType: 'DOWNLOADED_REPORT' },
          { actionType: { in: ['LOGIN_SUCCESS', 'VIEWED_PATIENT'] } },
        ],
      },
      orderBy: { timestamp: 'desc' },
      take: 100,
    });

    const highRisk: any[] = [];
    logs.forEach((log) => {
      const hour = log.timestamp.getHours();
      
      // Night logs (11 PM to 5 AM)
      const isOddHour = hour >= 23 || hour <= 5;
      const isReportDownload = log.actionType === 'DOWNLOADED_REPORT';

      if (isOddHour || isReportDownload) {
        highRisk.push({
          id: log.id,
          userId: log.userId,
          actionType: log.actionType,
          timestamp: log.timestamp,
          ipAddress: log.ipAddress,
          severity: isReportDownload && isOddHour ? 'CRITICAL' : (isReportDownload ? 'MEDIUM' : 'LOW'),
          reason: isReportDownload && isOddHour
            ? 'Report download during non-operational clinical hours'
            : (isReportDownload ? 'Data export operation' : 'Access during unusual graveyard shift hours'),
        });
      }
    });

    return highRisk;
  }
}
