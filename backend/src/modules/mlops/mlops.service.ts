import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TenantContextService } from '../tenancy/tenant-context.service';

@Injectable()
export class MlopsService {
  private readonly logger = new Logger(MlopsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContext: TenantContextService
  ) {}

  async evaluateDrift(modelName: string) {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) throw new Error('Tenant context missing');

    this.logger.log(`Evaluating data drift for model: ${modelName}`);

    // Fetch the active version of the model
    const activeModel = await this.prisma.modelRegistry.findFirst({
      where: { tenantId, modelName, status: 'ACTIVE' }
    });

    if (!activeModel) {
      this.logger.warn(`No active model found for ${modelName}`);
      return null;
    }

    // Simulated Drift Calculation
    const driftScore = parseFloat((Math.random() * 0.3).toFixed(3)); // Random drift up to 0.3
    const featureDrifts = {
      "blood_pressure_variance": driftScore * 0.8,
      "age_distribution": driftScore * 0.2
    };

    const metric = await this.prisma.driftMetric.create({
      data: {
        tenantId,
        modelId: activeModel.id,
        driftScore,
        featureDrifts
      }
    });

    if (driftScore > 0.25) {
      this.logger.warn(`[MLOps Alert] High drift detected on ${modelName}! Score: ${driftScore}`);
    }

    return metric;
  }

  async getDashboardData() {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) throw new Error('Tenant context missing');
    
    const models = await this.prisma.modelRegistry.findMany({
      where: { tenantId },
      orderBy: { deployedAt: 'desc' }
    });

    const metrics = await this.prisma.driftMetric.findMany({
      where: { tenantId },
      orderBy: { evaluatedAt: 'desc' },
      take: 10,
      include: {
        model: {
          select: { modelName: true, version: true }
        }
      }
    });

    return { models, metrics };
  }
}
