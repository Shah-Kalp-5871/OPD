import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { TenantContextService } from '../../tenancy/tenant-context.service';

@Injectable()
export class RoutingPolicyService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContext: TenantContextService,
  ) {}

  private getTenantId(): string {
    return (this.tenantContext.getTenantId() as string) || 'default-tenant';
  }

  async getRoutingPolicies() {
    const tenantId = this.getTenantId();
    let policies = await this.prisma.trafficRoutingPolicy.findMany({
      where: { tenantId },
    });

    if (policies.length === 0) {
      await this.prisma.trafficRoutingPolicy.create({
        data: {
          tenantId,
          policyName: 'Global Low-Latency Gateway Policy',
          routingMethod: 'LATENCY',
          primaryRegion: 'us-east-1',
          failoverRegion: 'us-west-2',
          isActive: true,
          activeRules: {
            rules: [
              { region: 'us-east-1', weight: 80, thresholdMs: 150 },
              { region: 'us-west-2', weight: 20, thresholdMs: 250 }
            ]
          },
        },
      });

      policies = await this.prisma.trafficRoutingPolicy.findMany({
        where: { tenantId },
      });
    }

    return policies;
  }

  async updateRoutingPolicy(id: string, data: { routingMethod: string; primaryRegion: string; failoverRegion: string }) {
    const tenantId = this.getTenantId();
    return this.prisma.trafficRoutingPolicy.updateMany({
      where: { id, tenantId },
      data: { ...data, updatedAt: new Date() },
    });
  }
}