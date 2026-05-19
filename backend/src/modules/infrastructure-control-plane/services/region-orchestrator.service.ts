import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { TenantContextService } from '../../tenancy/tenant-context.service';

@Injectable()
export class RegionOrchestratorService {
  private readonly logger = new Logger(RegionOrchestratorService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContext: TenantContextService,
  ) {}

  private getTenantId(): string {
    return (this.tenantContext.getTenantId() as string) || 'default-tenant';
  }

  async getRegions() {
    const tenantId = this.getTenantId();
    let regions = await this.prisma.cloudRegion.findMany({
      where: { tenantId },
      orderBy: { regionCode: 'asc' },
    });

    if (regions.length === 0) {
      // Seed default regions for rich visualization
      const defaults = [
        { regionCode: 'us-east-1', regionName: 'US East (N. Virginia)', provider: 'AWS', status: 'HEALTHY', latencyMs: 24, activeUsers: 450 },
        { regionCode: 'eu-west-1', regionName: 'Europe (Ireland)', provider: 'AWS', status: 'HEALTHY', latencyMs: 82, activeUsers: 180 },
        { regionCode: 'ap-south-1', regionName: 'Asia Pacific (Mumbai)', provider: 'AWS', status: 'HEALTHY', latencyMs: 145, activeUsers: 290 },
        { regionCode: 'us-west-2', regionName: 'US West (Oregon)', provider: 'GCP', status: 'HEALTHY', latencyMs: 42, activeUsers: 120 },
      ];

      for (const d of defaults) {
        await this.prisma.cloudRegion.create({
          data: { tenantId, ...d },
        });
      }

      regions = await this.prisma.cloudRegion.findMany({
        where: { tenantId },
        orderBy: { regionCode: 'asc' },
      });
    }

    return regions;
  }

  async updateRegionStatus(id: string, status: string) {
    const tenantId = this.getTenantId();
    return this.prisma.cloudRegion.updateMany({
      where: { id, tenantId },
      data: { status, updatedAt: new Date() },
    });
  }
}