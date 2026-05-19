import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { TenantContextService } from '../../tenancy/tenant-context.service';

@Injectable()
export class CapacityForecastService {
  private readonly logger = new Logger(CapacityForecastService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContext: TenantContextService,
  ) {}

  private getTenantId(): string {
    return (this.tenantContext.getTenantId() as string) || 'default-tenant';
  }

  async generateForecasts(branchId?: string) {
    const tenantId = this.getTenantId();
    const now = new Date();

    // Create simulated forecasts for next 24 hours
    const forecasts: any[] = [];
    const forecastTypes = ['ER_CONGESTION', 'BED_DEMAND', 'STAFF_SATURATION'];

    for (const type of forecastTypes) {
      const targetTime = new Date(now.getTime() + 4 * 60 * 60 * 1000); // 4 hours from now
      const value = type === 'ER_CONGESTION' ? 82.5 : type === 'BED_DEMAND' ? 94.0 : 78.2;

      const forecast = await this.prisma.operationalForecast.create({
        data: {
          tenantId,
          branchId: branchId || null,
          forecastType: type,
          targetTime,
          forecastValue: value,
          confidence: 0.88,
          metadata: {
            simulationSource: 'AI_TWIN_AUTO_FORECAST',
            riskIndicator: value > 80.0 ? 'HIGH_WARNING' : 'STABLE',
          },
        },
      });
      forecasts.push(forecast);
    }

    return forecasts;
  }

  async getForecasts(type?: string) {
    const tenantId = this.getTenantId();
    return this.prisma.operationalForecast.findMany({
      where: {
        tenantId,
        forecastType: type ? type : undefined,
      },
      orderBy: { targetTime: 'asc' },
    });
  }

  async getCapacitySimulations() {
    const tenantId = this.getTenantId();
    // Fetch active simulated capacities
    let simulations: any[] = await this.prisma.capacitySimulation.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });

    if (simulations.length === 0) {
      // Seed initial simulation states
      const seedItems = [
        { resourceType: 'BED', simulatedLoad: 92.5, bottleneckRisk: 'HIGH', mitigationAdvice: 'Discharge stable patients early.' },
        { resourceType: 'ICU', simulatedLoad: 96.0, bottleneckRisk: 'CRITICAL', mitigationAdvice: 'Route incoming critical cases to Branch B.' },
        { resourceType: 'VENTILATOR', simulatedLoad: 45.0, bottleneckRisk: 'LOW', mitigationAdvice: 'Adequate stocks available.' },
        { resourceType: 'STAFF', simulatedLoad: 88.0, bottleneckRisk: 'HIGH', mitigationAdvice: 'Trigger dynamic float pool nurses allocation.' },
      ];

      for (const item of seedItems) {
        const sim = await this.prisma.capacitySimulation.create({
          data: {
            tenantId,
            resourceType: item.resourceType,
            simulatedLoad: item.simulatedLoad,
            bottleneckRisk: item.bottleneckRisk,
            mitigationAdvice: item.mitigationAdvice,
          },
        });
        simulations.push(sim);
      }
    }

    return simulations;
  }
}
