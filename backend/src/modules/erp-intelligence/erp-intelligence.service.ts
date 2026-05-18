import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TenantContextService } from '../tenancy/tenant-context.service';

@Injectable()
export class ErpIntelligenceService {
  private readonly logger = new Logger(ErpIntelligenceService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContext: TenantContextService,
  ) {}

  async getExecutiveSummary() {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) throw new Error('Tenant context missing');

    this.logger.log('Generating enterprise ERP executive summary');

    const [
      totalEmployees,
      activeEmployees,
      openPOs,
      criticalTickets,
      openIncidents,
      expiryAlerts,
      assetsUnderMaintenance,
      pendingLeaves,
    ] = await Promise.all([
      this.prisma.employee.count({ where: { tenantId } }),
      this.prisma.employee.count({ where: { tenantId, status: 'ACTIVE' } }),
      this.prisma.purchaseOrder.count({ where: { tenantId, status: { in: ['DRAFT', 'SENT', 'CONFIRMED'] } } }),
      this.prisma.maintenanceTicket.count({ where: { tenantId, priority: 'CRITICAL', status: { not: 'RESOLVED' } } }),
      this.prisma.incidentReport.count({ where: { tenantId, status: 'OPEN' } }),
      this.prisma.expiryAlert.count({ where: { tenantId, resolved: false, alertLevel: 'CRITICAL' } }),
      this.prisma.biomedicalAsset.count({ where: { tenantId, status: 'UNDER_MAINTENANCE' } }),
      this.prisma.leaveRequest.count({ where: { tenantId, status: 'PENDING' } }),
    ]);

    const recentPayroll = await this.prisma.payrollCycle.findFirst({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });

    const operationalScore = this.calcOperationalScore({
      criticalTickets, openIncidents, expiryAlerts, assetsUnderMaintenance,
    });

    return {
      workforce: { totalEmployees, activeEmployees, pendingLeaves },
      procurement: { openPOs },
      facility: { criticalTickets, openIncidents },
      pharmacy: { expiryAlerts },
      biomedical: { assetsUnderMaintenance },
      payroll: { recentMonth: recentPayroll?.month, totalNetPay: recentPayroll?.totalNetPay },
      operationalScore,
      aiInsights: this.generateInsights({ criticalTickets, openIncidents, expiryAlerts }),
    };
  }

  private calcOperationalScore(metrics: {
    criticalTickets: number;
    openIncidents: number;
    expiryAlerts: number;
    assetsUnderMaintenance: number;
  }): number {
    let score = 100;
    score -= metrics.criticalTickets * 5;
    score -= metrics.openIncidents * 4;
    score -= metrics.expiryAlerts * 3;
    score -= metrics.assetsUnderMaintenance * 2;
    return Math.max(0, Math.min(100, score));
  }

  private generateInsights(metrics: { criticalTickets: number; openIncidents: number; expiryAlerts: number }): string[] {
    const insights: string[] = [];
    if (metrics.criticalTickets > 3) insights.push('🔴 Multiple critical maintenance tickets require immediate escalation.');
    if (metrics.openIncidents > 5) insights.push('⚠️ High incident volume detected — consider safety audit.');
    if (metrics.expiryAlerts > 0) insights.push('💊 Pharmacy expiry critical alerts require urgent disposal action.');
    if (insights.length === 0) insights.push('✅ All enterprise operations are within normal parameters.');
    return insights;
  }
}
