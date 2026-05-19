import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { TenantContextService } from '../../tenancy/tenant-context.service';

@Injectable()
export class AnalyticsGovernanceService {
  private readonly logger = new Logger(AnalyticsGovernanceService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContext: TenantContextService,
  ) {}

  private getTenantId(): string {
    return (this.tenantContext.getTenantId() as string) || '';
  }

  async getReconciliationReport(): Promise<any> {
    const tenantId = this.getTenantId();
    try {
      // Reconcile source tables vs DW facts to identify synchronization gaps
      const sourceAppointments = await this.prisma.$queryRawUnsafe<any[]>(
        `SELECT COUNT(*) as count FROM "Appointment" WHERE "tenantId" = $1`, tenantId
      ).then(res => Number(res?.[0]?.count || 0));

      const dwAppointments = await this.prisma.analyticsFactAppointment.count({
        where: { tenantId },
      });

      const sourceInvoices = await this.prisma.$queryRawUnsafe<any[]>(
        `SELECT COUNT(*) as count FROM "Invoice" WHERE "tenantId" = $1`, tenantId
      ).then(res => Number(res?.[0]?.count || 0));

      const dwInvoices = await this.prisma.analyticsFactRevenue.count({
        where: { tenantId },
      });

      const gapAppointments = sourceAppointments - dwAppointments;
      const gapInvoices = sourceInvoices - dwInvoices;

      return {
        timestamp: new Date().toISOString(),
        tenantId,
        reconciliation: {
          appointments: {
            sourceCount: sourceAppointments,
            warehouseCount: dwAppointments,
            gap: gapAppointments,
            status: gapAppointments === 0 ? 'SYNCHRONIZED' : 'LAGGING',
          },
          financials: {
            sourceCount: sourceInvoices,
            warehouseCount: dwInvoices,
            gap: gapInvoices,
            status: gapInvoices === 0 ? 'SYNCHRONIZED' : 'LAGGING',
          },
        },
      };
    } catch (err) {
      this.logger.error(`Reconciliation report failed: ${err.message}`);
      return {
        timestamp: new Date().toISOString(),
        status: 'ERROR',
        error: err.message,
      };
    }
  }

  async getQueryPerformanceMetrics(): Promise<any> {
    // Return mock BI query latency metrics
    return {
      averageLatencyMs: 42,
      "95thPercentileMs": 85,
      "99thPercentileMs": 145,
      slowestQueries: [
        { query: 'FactRevenue group by revenueType', latencyMs: 120, date: new Date().toISOString() },
        { query: 'FactAppointment waitTimeMinutes average', latencyMs: 78, date: new Date().toISOString() },
      ],
    };
  }
}
