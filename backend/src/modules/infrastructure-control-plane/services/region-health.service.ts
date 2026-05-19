import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { TenantContextService } from '../../tenancy/tenant-context.service';

@Injectable()
export class RegionHealthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContext: TenantContextService,
  ) {}

  private getTenantId(): string {
    return (this.tenantContext.getTenantId() as string) || 'default-tenant';
  }

  async getHealthMetrics(regionCode?: string) {
    const tenantId = this.getTenantId();
    let metrics = await this.prisma.regionHealthMetric.findMany({
      where: { tenantId, ...(regionCode ? { regionCode } : {}) },
      orderBy: { timestamp: 'desc' },
      take: 100,
    });

    if (metrics.length === 0) {
      // Seed diverse metrics
      const regions = ['us-east-1', 'eu-west-1', 'ap-south-1', 'us-west-2'];
      for (const r of regions) {
        await this.prisma.regionHealthMetric.create({
          data: {
            tenantId,
            regionCode: r,
            cpuLoad: 42.5 + Math.random() * 20,
            memoryLoad: 58.2 + Math.random() * 15,
            networkLatencyMs: r === 'us-east-1' ? 12 : r === 'eu-west-1' ? 78 : 132,
            packetLoss: 0.0,
            errorRate: 0.001 + Math.random() * 0.002,
          },
        });
      }
      metrics = await this.prisma.regionHealthMetric.findMany({
        where: { tenantId },
        orderBy: { timestamp: 'desc' },
      });
    }

    return metrics;
  }

  async getInfrastructureIncidents() {
    const tenantId = this.getTenantId();
    let incidents = await this.prisma.infrastructureIncident.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });

    if (incidents.length === 0) {
      await this.prisma.infrastructureIncident.create({
        data: {
          tenantId,
          incidentTitle: 'BGP Routing Table Leakage Flapping',
          severity: 'HIGH',
          affectedRegion: 'eu-west-1',
          status: 'RESOLVED',
          rootCause: 'Upstream transit provider misconfigured peer filters.',
          remediationSteps: 'Re-routed edge gateways to secondary tier-1 backbone carrier.',
          resolvedAt: new Date(),
        },
      });

      incidents = await this.prisma.infrastructureIncident.findMany({
        where: { tenantId },
        orderBy: { createdAt: 'desc' },
      });
    }

    return incidents;
  }

  async createIncident(title: string, severity: string, region: string) {
    const tenantId = this.getTenantId();
    return this.prisma.infrastructureIncident.create({
      data: {
        tenantId,
        incidentTitle: title,
        severity,
        affectedRegion: region,
        status: 'OPEN',
      },
    });
  }
}