import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { TenantContextService } from '../../tenancy/tenant-context.service';

@Injectable()
export class WellnessTrackingService {
  private readonly logger = new Logger(WellnessTrackingService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContext: TenantContextService,
  ) {}

  private getTenantId(): string {
    return (this.tenantContext.getTenantId() as string) || 'default-tenant';
  }

  async getMetrics(patientId: string) {
    const tenantId = this.getTenantId();
    let metrics = await this.prisma.wellnessMetric.findMany({
      where: { tenantId, patientId },
      orderBy: { loggedAt: 'desc' },
      take: 50,
    });

    if (metrics.length === 0) {
      await this.prisma.wellnessMetric.create({
        data: {
          tenantId,
          patientId,
          metricType: 'Blood Pressure',
          value: 120.0,
          unit: 'mmHg',
        },
      });
      metrics = await this.prisma.wellnessMetric.findMany({
        where: { tenantId, patientId },
      });
    }

    return metrics;
  }

  async logMetric(patientId: string, metricType: string, value: number, unit: string) {
    const tenantId = this.getTenantId();
    return this.prisma.wellnessMetric.create({
      data: {
        tenantId,
        patientId,
        metricType,
        value,
        unit,
      },
    });
  }
}