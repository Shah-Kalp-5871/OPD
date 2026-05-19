import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { TenantContextService } from '../../tenancy/tenant-context.service';

@Injectable()
export class KubernetesOpsService {
  private readonly logger = new Logger(KubernetesOpsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContext: TenantContextService,
  ) {}

  private getTenantId(): string {
    return (this.tenantContext.getTenantId() as string) || 'default-tenant';
  }

  async getClusterNodes() {
    const tenantId = this.getTenantId();
    let nodes = await this.prisma.clusterNode.findMany({
      where: { tenantId },
    });

    if (nodes.length === 0) {
      const defaults = [
        { nodeName: 'k8s-node-worker-a1', regionCode: 'us-east-1', status: 'READY', cpuUsage: 34.5, memoryUsage: 54.2, podCount: 18 },
        { nodeName: 'k8s-node-worker-a2', regionCode: 'us-east-1', status: 'READY', cpuUsage: 41.2, memoryUsage: 62.0, podCount: 22 },
        { nodeName: 'k8s-node-worker-b1', regionCode: 'eu-west-1', status: 'READY', cpuUsage: 22.8, memoryUsage: 41.5, podCount: 12 },
        { nodeName: 'k8s-node-worker-c1', regionCode: 'ap-south-1', status: 'READY', cpuUsage: 55.4, memoryUsage: 71.8, podCount: 25 },
      ];

      for (const d of defaults) {
        await this.prisma.clusterNode.create({
          data: { tenantId, ...d },
        });
      }

      nodes = await this.prisma.clusterNode.findMany({
        where: { tenantId },
      });
    }

    return nodes;
  }
}