import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { TenantContextService } from '../../tenancy/tenant-context.service';

@Injectable()
export class DeploymentPipelineService {
  private readonly logger = new Logger(DeploymentPipelineService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContext: TenantContextService,
  ) {}

  private getTenantId(): string {
    return (this.tenantContext.getTenantId() as string) || 'default-tenant';
  }

  async getDeployments() {
    const tenantId = this.getTenantId();
    let deployments = await this.prisma.deploymentRegion.findMany({
      where: { tenantId },
    });

    if (deployments.length === 0) {
      const defaults = [
        { deploymentName: 'medflow-api-core', regionCode: 'us-east-1', replicaCount: 4, targetReplicas: 4, version: 'v1.42.0', status: 'RUNNING' },
        { deploymentName: 'medflow-api-core', regionCode: 'eu-west-1', replicaCount: 2, targetReplicas: 2, version: 'v1.42.0', status: 'RUNNING' },
        { deploymentName: 'medflow-web-portal', regionCode: 'us-east-1', replicaCount: 3, targetReplicas: 3, version: 'v1.42.0', status: 'RUNNING' },
      ];

      for (const d of defaults) {
        await this.prisma.deploymentRegion.create({
          data: { tenantId, ...d },
        });
      }

      deployments = await this.prisma.deploymentRegion.findMany({
        where: { tenantId },
      });
    }

    return deployments;
  }
}