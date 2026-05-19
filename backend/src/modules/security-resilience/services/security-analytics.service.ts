import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { TenantContextService } from '../../tenancy/tenant-context.service';

@Injectable()
export class SecurityAnalyticsService {
  private readonly logger = new Logger(SecurityAnalyticsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContext: TenantContextService,
  ) {}

  private getTenantId(): string {
    return (this.tenantContext.getTenantId() as string) || '';
  }

  // --- Security Events (SIEM Ingestion) ---
  async logEvent(data: {
    userId?: string;
    eventType: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    ipAddress?: string;
    userAgent?: string;
    details?: any;
  }) {
    const tenantId = this.getTenantId();
    const event = await this.prisma.securityEvent.create({
      data: {
        tenantId,
        userId: data.userId,
        eventType: data.eventType,
        severity: data.severity,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        details: data.details || {},
      },
    });

    // Auto-alerting rules engine
    if (data.severity === 'HIGH' || data.severity === 'CRITICAL') {
      await this.triggerAlert({
        title: `High Severity Event: ${data.eventType}`,
        description: `High severity security event ingested. Source IP: ${data.ipAddress || 'Unknown'}. Event detail summary: ${JSON.stringify(data.details || {})}`,
        severity: data.severity,
        correlationId: event.id,
      });
    }

    return event;
  }

  async getEvents(limit = 100) {
    const tenantId = this.getTenantId();
    return this.prisma.securityEvent.findMany({
      where: { tenantId },
      orderBy: { timestamp: 'desc' },
      take: limit,
    });
  }

  // --- Security Alerts ---
  async triggerAlert(data: {
    title: string;
    description: string;
    severity: string;
    correlationId?: string;
  }) {
    const tenantId = this.getTenantId();
    return this.prisma.securityAlert.create({
      data: {
        tenantId,
        title: data.title,
        description: data.description,
        severity: data.severity,
        status: 'NEW',
        correlationId: data.correlationId,
      },
    });
  }

  async getAlerts() {
    const tenantId = this.getTenantId();
    return this.prisma.securityAlert.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateAlertStatus(alertId: string, status: 'NEW' | 'INVESTIGATING' | 'RESOLVED' | 'SUPPRESSED', assignee?: string) {
    const tenantId = this.getTenantId();
    const alert = await this.prisma.securityAlert.findFirst({
      where: { id: alertId, tenantId },
    });

    if (!alert) {
      throw new NotFoundException(`Alert ${alertId} not found`);
    }

    return this.prisma.securityAlert.update({
      where: { id: alertId },
      data: { status, assignedTo: assignee },
    });
  }

  // --- Security Incidents & Playbooks ---
  async getIncidents() {
    const tenantId = this.getTenantId();
    return this.prisma.securityIncident.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createIncident(data: {
    title: string;
    description: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    playbookId?: string;
  }) {
    const tenantId = this.getTenantId();
    const incident = await this.prisma.securityIncident.create({
      data: {
        tenantId,
        title: data.title,
        description: data.description,
        severity: data.severity,
        status: 'OPEN',
        playbookId: data.playbookId,
      },
    });

    await this.logTimeline({
      incidentId: incident.id,
      actionTaken: 'Incident Created & Assigned to Triage Queue',
      performedBy: 'SIEM Autonomous Engine',
    });

    return incident;
  }

  async updateIncident(
    incidentId: string,
    data: { status: 'OPEN' | 'CONTAINED' | 'RESOLVED' | 'CLOSED'; assignee?: string; resolutionSummary?: string },
  ) {
    const tenantId = this.getTenantId();
    const incident = await this.prisma.securityIncident.findFirst({
      where: { id: incidentId, tenantId },
    });

    if (!incident) {
      throw new NotFoundException(`Incident ${incidentId} not found`);
    }

    const updated = await this.prisma.securityIncident.update({
      where: { id: incidentId },
      data: {
        status: data.status,
        assignedTo: data.assignee,
        resolutionSummary: data.resolutionSummary,
      },
    });

    await this.logTimeline({
      incidentId,
      actionTaken: `Incident status updated to ${data.status}`,
      performedBy: data.assignee || 'SOC Lead',
      details: data.resolutionSummary,
    });

    return updated;
  }

  // --- Incident Timelines ---
  async logTimeline(data: { incidentId: string; actionTaken: string; performedBy: string; details?: string }) {
    const tenantId = this.getTenantId();
    return this.prisma.securityTimeline.create({
      data: {
        tenantId,
        incidentId: data.incidentId,
        actionTaken: data.actionTaken,
        performedBy: data.performedBy,
        details: data.details,
      },
    });
  }

  async getIncidentTimeline(incidentId: string) {
    const tenantId = this.getTenantId();
    return this.prisma.securityTimeline.findMany({
      where: { tenantId, incidentId },
      orderBy: { occurredAt: 'asc' },
    });
  }

  // --- Audit Correlation Rules ---
  async runAuditCorrelations() {
    const tenantId = this.getTenantId();
    // Brute force threshold correlation logic
    const fiveMinsAgo = new Date(Date.now() - 5 * 60 * 1000);
    const authFailures = await this.prisma.securityEvent.findMany({
      where: {
        tenantId,
        eventType: 'AUTH_FAILURE',
        timestamp: { gte: fiveMinsAgo },
      },
    });

    if (authFailures.length >= 5) {
      // Trigger a correlated alert
      await this.triggerAlert({
        title: 'Brute Force Attack Detected',
        description: `Correlated ${authFailures.length} AUTH_FAILURE events inside a 5-minute window for the tenant. Immediate IP throttling recommended.`,
        severity: 'HIGH',
      });

      return this.prisma.auditCorrelation.create({
        data: {
          tenantId,
          correlationType: 'BRUTE_FORCE',
          alertCount: authFailures.length,
          eventSummary: { events: authFailures.map(e => e.id) },
          startTime: fiveMinsAgo,
          endTime: new Date(),
        },
      });
    }

    return { message: 'Correlation run completed. No threat matches found.' };
  }

  async getCorrelations() {
    const tenantId = this.getTenantId();
    return this.prisma.auditCorrelation.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
