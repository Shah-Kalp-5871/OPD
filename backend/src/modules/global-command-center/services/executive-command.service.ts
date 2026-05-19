import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { TenantContextService } from '../../tenancy/tenant-context.service';

@Injectable()
export class ExecutiveCommandService {
  private readonly logger = new Logger(ExecutiveCommandService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContext: TenantContextService,
  ) {}

  private getTenantId(): string {
    return (this.tenantContext.getTenantId() as string) || 'default-tenant';
  }

  async getExecutiveOverview() {
    const tenantId = this.getTenantId();

    const openIncidents = await this.prisma.systemLiveIncident.findMany({
      where: { tenantId, status: 'OPEN' },
      orderBy: { createdAt: 'desc' },
    });

    if (openIncidents.length === 0) {
      // Seed an initial open incident if empty
      await this.prisma.systemLiveIncident.create({
        data: {
          tenantId,
          sourceModule: 'SOC',
          title: 'Unauthenticated API access attempts detected on billing router.',
          severity: 'WARNING',
          status: 'OPEN',
        },
      });
    }

    const currentIncidents = await this.prisma.systemLiveIncident.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    const activeDecisions = await this.prisma.autonomousDecision.findMany({
      where: { tenantId, status: 'PENDING' },
      take: 5,
    });

    // Patient engagement summary
    const npsRecords = await this.prisma.npsScore.findMany({
      where: { tenantId },
    });
    const avgNps = npsRecords.length > 0
      ? npsRecords.reduce((sum, n) => sum + n.score, 0) / npsRecords.length
      : 8.8;

    return {
      incidents: currentIncidents,
      pendingDecisions: activeDecisions,
      npsAverage: parseFloat(avgNps.toFixed(1)),
      platformRiskLevel: openIncidents.some(i => i.severity === 'CRITICAL') ? 'CRITICAL' : openIncidents.length > 0 ? 'WARNING' : 'LOW',
    };
  }

  async resolveIncident(incidentId: string, resolutionSummary: string) {
    const tenantId = this.getTenantId();

    await this.prisma.systemLiveIncident.updateMany({
      where: { tenantId, id: incidentId },
      data: {
        status: 'RESOLVED',
        resolvedAt: new Date(),
      },
    });

    await this.prisma.operationalTimelineEvent.create({
      data: {
        tenantId,
        eventType: 'SECURITY',
        severity: 'INFO',
        message: `Incident ID ${incidentId} resolved: ${resolutionSummary}`,
        regionName: 'GLOBAL',
      },
    });

    return { success: true, message: 'Incident marked as resolved.' };
  }
}
