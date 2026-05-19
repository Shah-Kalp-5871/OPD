import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { TenantContextService } from '../../tenancy/tenant-context.service';

@Injectable()
export class ZeroTrustService {
  private readonly logger = new Logger(ZeroTrustService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContext: TenantContextService,
  ) {}

  private getTenantId(): string {
    return (this.tenantContext.getTenantId() as string) || '';
  }

  // --- Security Policy ---
  async getPolicy() {
    const tenantId = this.getTenantId();
    let policy = await this.prisma.securityPolicy.findFirst({
      where: { tenantId },
    });

    if (!policy) {
      // Create default policy
      policy = await this.prisma.securityPolicy.create({
        data: {
          tenantId,
          mfaRequired: true,
          maxConcurrentSessions: 3,
          sessionTimeoutMins: 30,
          passwordExpiryDays: 90,
          allowedIpRanges: ['0.0.0.0/0'],
          allowedCountries: ['US', 'IN', 'GB'],
          allowTor: false,
          minDeviceTrustScore: 70.0,
        },
      });
    }
    return policy;
  }

  async updatePolicy(data: {
    mfaRequired?: boolean;
    maxConcurrentSessions?: number;
    sessionTimeoutMins?: number;
    passwordExpiryDays?: number;
    allowedIpRanges?: string[];
    allowedCountries?: string[];
    allowTor?: boolean;
    minDeviceTrustScore?: number;
  }) {
    const tenantId = this.getTenantId();
    const current = await this.getPolicy();
    return this.prisma.securityPolicy.update({
      where: { id: current.id },
      data,
    });
  }

  // --- Device Trust ---
  async registerDevice(data: {
    userId: string;
    deviceId: string;
    deviceName?: string;
    deviceOs?: string;
    browser?: string;
    antivirusEnabled?: boolean;
    diskEncrypted?: boolean;
    osPatched?: boolean;
    isJailbroken?: boolean;
  }) {
    const tenantId = this.getTenantId();
    let score = 100.0;
    if (!data.antivirusEnabled) score -= 20;
    if (!data.diskEncrypted) score -= 30;
    if (!data.osPatched) score -= 15;
    if (data.isJailbroken) score -= 50;
    if (score < 0) score = 0;

    const status = score >= 70 ? 'TRUSTED' : 'UNTRUSTED';

    return this.prisma.deviceTrust.upsert({
      where: { deviceId: data.deviceId },
      create: {
        tenantId,
        userId: data.userId,
        deviceId: data.deviceId,
        deviceName: data.deviceName || 'Unknown Device',
        deviceOs: data.deviceOs || 'Unknown OS',
        browser: data.browser || 'Unknown Browser',
        antivirusEnabled: data.antivirusEnabled ?? true,
        diskEncrypted: data.diskEncrypted ?? true,
        osPatched: data.osPatched ?? true,
        isJailbroken: data.isJailbroken ?? false,
        trustScore: score,
        status,
      },
      update: {
        antivirusEnabled: data.antivirusEnabled ?? true,
        diskEncrypted: data.diskEncrypted ?? true,
        osPatched: data.osPatched ?? true,
        isJailbroken: data.isJailbroken ?? false,
        trustScore: score,
        status,
        lastActiveAt: new Date(),
      },
    });
  }

  async getDevices() {
    const tenantId = this.getTenantId();
    return this.prisma.deviceTrust.findMany({
      where: { tenantId },
      orderBy: { updatedAt: 'desc' },
    });
  }

  // --- IP and Geo Rules ---
  async getIpPolicies() {
    const tenantId = this.getTenantId();
    return this.prisma.ipAccessPolicy.findMany({
      where: { tenantId },
    });
  }

  async addIpPolicy(data: { cidrBlock: string; policyType: 'ALLOW' | 'BLOCK'; description?: string }) {
    const tenantId = this.getTenantId();
    return this.prisma.ipAccessPolicy.create({
      data: {
        tenantId,
        cidrBlock: data.cidrBlock,
        policyType: data.policyType,
        description: data.description,
        isActive: true,
      },
    });
  }

  async getGeoRules() {
    const tenantId = this.getTenantId();
    return this.prisma.geoAccessRule.findMany({
      where: { tenantId },
    });
  }

  async addGeoRule(data: { countryCode: string; policyType: 'ALLOW' | 'BLOCK' }) {
    const tenantId = this.getTenantId();
    return this.prisma.geoAccessRule.create({
      data: {
        tenantId,
        countryCode: data.countryCode,
        policyType: data.policyType,
        isActive: true,
      },
    });
  }

  // --- Dynamic Risk Calculations ---
  async evaluateSessionRisk(data: {
    userId: string;
    sessionId: string;
    ipAddress: string;
    userAgent: string;
    geoCountry?: string;
  }) {
    const tenantId = this.getTenantId();
    let score = 10.0; // Base baseline risk score
    let impossibleTravel = false;
    let proxyOrTor = false;
    let geoMismatch = false;

    // Simulate heuristics
    if (data.ipAddress === '127.0.0.1' || data.ipAddress === 'localhost') {
      score = 5.0;
    } else {
      if (data.geoCountry && data.geoCountry !== 'US') {
        geoMismatch = true;
        score += 25;
      }
      if (data.userAgent.toLowerCase().includes('bot') || data.userAgent.toLowerCase().includes('curl')) {
        proxyOrTor = true;
        score += 40;
      }
    }

    const overallRisk = score >= 70 ? 'HIGH' : score >= 40 ? 'MEDIUM' : 'LOW';

    return this.prisma.sessionRiskScore.create({
      data: {
        tenantId,
        userId: data.userId,
        sessionId: data.sessionId,
        impossibleTravel,
        proxyOrTor,
        suspiciousTiming: false,
        geoMismatch,
        privilegeEscalation: false,
        overallRisk,
        calculatedScore: score,
        evidence: { ipAddress: data.ipAddress, userAgent: data.userAgent },
      },
    });
  }

  async getRiskScores() {
    const tenantId = this.getTenantId();
    return this.prisma.sessionRiskScore.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }
}
