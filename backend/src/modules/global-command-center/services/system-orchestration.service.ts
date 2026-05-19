import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { TenantContextService } from '../../tenancy/tenant-context.service';

@Injectable()
export class SystemOrchestrationService {
  private readonly logger = new Logger(SystemOrchestrationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContext: TenantContextService,
  ) {}

  private getTenantId(): string {
    return (this.tenantContext.getTenantId() as string) || 'default-tenant';
  }

  async getInfrastructureStatus() {
    const tenantId = this.getTenantId();

    // Query our simulated regional nodes
    const activeNodes = await this.prisma.regionalAiNode.findMany({
      where: { tenantId },
    });

    if (activeNodes.length === 0) {
      // Seed default active regional AI nodes
      const defaultNodes = [
        { regionName: 'US-EAST-PRIMARY', endpointUrl: 'https://us-east.medflow.internal', healthStatus: 'ONLINE' },
        { regionName: 'EU-WEST-SECONDARY', endpointUrl: 'https://eu-west.medflow.internal', healthStatus: 'ONLINE' },
        { regionName: 'AP-SOUTH-EDGE', endpointUrl: 'https://ap-south.medflow.internal', healthStatus: 'ONLINE' },
      ];

      for (const node of defaultNodes) {
        await this.prisma.regionalAiNode.create({
          data: {
            tenantId,
            regionName: node.regionName,
            endpointUrl: node.endpointUrl,
            healthStatus: node.healthStatus,
          },
        });
      }
    }

    const liveNodes = await this.prisma.regionalAiNode.findMany({
      where: { tenantId },
    });

    return {
      nodes: liveNodes,
      activeDirectives: await this.prisma.aiOperationalDirective.findMany({
        where: { tenantId, status: 'ACTIVE' },
        take: 5,
      }),
      failoverStatus: {
        activeReplica: 'EU-WEST-SECONDARY',
        failoverTriggered: false,
        lastHealthCheck: new Date(),
      },
    };
  }

  async triggerEmergencyFailover(targetNodeId: string) {
    const tenantId = this.getTenantId();

    this.logger.warn(`EMERGENCY FAILOVER TRIGGERED for node: ${targetNodeId}`);

    // Update node health and write timeline event
    await this.prisma.regionalAiNode.updateMany({
      where: { tenantId, id: targetNodeId },
      data: { healthStatus: 'FAILOVER' },
    });

    await this.prisma.operationalTimelineEvent.create({
      data: {
        tenantId,
        eventType: 'INFRASTRUCTURE',
        severity: 'CRITICAL',
        message: `Dynamic emergency failover routing triggered for node ID ${targetNodeId}. Traffic balance shifted to standby replica.`,
        regionName: 'GLOBAL',
      },
    });

    return { success: true, message: 'Emergency failover initiated. Router rules shifted.' };
  }
}
