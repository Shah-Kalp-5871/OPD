import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { TenantContextService } from '../../tenancy/tenant-context.service';

@Injectable()
export class SimulationEngineService {
  private readonly logger = new Logger(SimulationEngineService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContext: TenantContextService,
  ) {}

  private getTenantId(): string {
    return (this.tenantContext.getTenantId() as string) || 'default-tenant';
  }

  async createScenario(data: any) {
    const tenantId = this.getTenantId();
    return this.prisma.digitalTwinScenario.create({
      data: {
        tenantId,
        branchId: data.branchId || null,
        name: data.name,
        description: data.description,
        config: data.config || {},
        isActive: data.isActive !== undefined ? data.isActive : true,
      },
    });
  }

  async getScenarios() {
    const tenantId = this.getTenantId();
    return this.prisma.digitalTwinScenario.findMany({
      where: { tenantId },
      include: { runs: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async runSimulation(scenarioId: string, inputConfig: any) {
    const tenantId = this.getTenantId();
    const scenario = await this.prisma.digitalTwinScenario.findFirst({
      where: { id: scenarioId, tenantId },
    });

    if (!scenario) {
      throw new Error('Scenario not found');
    }

    const run = await this.prisma.simulationRun.create({
      data: {
        tenantId,
        branchId: scenario.branchId,
        scenarioId,
        status: 'RUNNING',
        startedAt: new Date(),
        inputConfig: inputConfig || scenario.config,
      },
    });

    // Run simulated modeling:
    // Simulating ER, ICU, Bed load based on input factors
    const severityMultiplier = inputConfig.disasterSeverity === 'CRITICAL' ? 2.5 : 1.2;
    const casualtyCount = inputConfig.casualtyCount || 50;

    const outputMetrics = {
      icuOccupancySimulated: Math.min(98.5, 65.0 + casualtyCount * 0.4 * severityMultiplier),
      erWaitTimeSimulatedMinutes: Math.round(15.0 + casualtyCount * 1.8 * severityMultiplier),
      bedBottleneckProbability: Math.min(1.0, 0.3 + casualtyCount * 0.01 * severityMultiplier),
      staffSaturationIndex: Math.min(100.0, 50.0 + casualtyCount * 0.6 * severityMultiplier),
      ambulanceRoutingEfficiency: Math.max(25.0, 92.0 - casualtyCount * 0.5 * severityMultiplier),
    };

    const completedRun = await this.prisma.simulationRun.update({
      where: { id: run.id },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
        outputMetrics,
      },
    });

    // Generate active Twin Recommendation if risk is high
    if (outputMetrics.bedBottleneckProbability > 0.6) {
      await this.prisma.twinRecommendation.create({
        data: {
          tenantId,
          branchId: scenario.branchId,
          title: 'Activate Overflow Care Pathway',
          description: `Disaster scenario simulated bed bottleneck risk is ${(outputMetrics.bedBottleneckProbability * 100).toFixed(1)}%. Reallocate non-emergency wards immediately.`,
          impactScore: 84.5,
        },
      });

      await this.prisma.twinEvent.create({
        data: {
          tenantId,
          branchId: scenario.branchId,
          severity: 'CRITICAL',
          category: 'BED_DEMAND',
          message: `Digital Twin predicts severe bed saturation under scenario: ${scenario.name}`,
          metadata: outputMetrics,
        },
      });
    }

    return completedRun;
  }

  async getSimulationRuns(scenarioId?: string) {
    const tenantId = this.getTenantId();
    return this.prisma.simulationRun.findMany({
      where: {
        tenantId,
        scenarioId: scenarioId ? scenarioId : undefined,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
