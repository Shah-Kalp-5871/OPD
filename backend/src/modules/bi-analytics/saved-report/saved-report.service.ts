import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { TenantContextService } from '../../tenancy/tenant-context.service';

@Injectable()
export class SavedReportService {
  private readonly logger = new Logger(SavedReportService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContext: TenantContextService,
  ) {}

  private getTenantId(): string {
    return (this.tenantContext.getTenantId() as string) || '';
  }

  async createReport(data: {
    reportName: string;
    description?: string;
    queryConfig: any;
    creatorId: string;
  }) {
    const tenantId = this.getTenantId();
    return this.prisma.scheduledReport.create({
      data: {
        tenantId,
        userId: data.creatorId,
        name: data.reportName,
        queryConfig: data.queryConfig,
        scheduleCron: '0 9 * * 1', // Weekly default
        recipients: [],
        status: 'ACTIVE',
      },
    });
  }

  async listReports() {
    const tenantId = this.getTenantId();
    return this.prisma.scheduledReport.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async executeReport(reportId: string): Promise<any> {
    const tenantId = this.getTenantId();
    const report = await this.prisma.scheduledReport.findFirst({
      where: { id: reportId, tenantId },
    });

    if (!report) {
      throw new NotFoundException(`Report ${reportId} not found`);
    }

    const queryType = (report.queryConfig as any)?.type || 'APPOINTMENTS';
    
    if (queryType === 'REVENUE') {
      const result = await this.prisma.analyticsFactRevenue.groupBy({
        by: ['revenueType'],
        where: { tenantId },
        _sum: { amountBilled: true, amountCollected: true },
      });
      return { reportId, name: report.name, data: result };
    }

    if (queryType === 'PATIENTS') {
      const result = await this.prisma.analyticsFactPatient.groupBy({
        by: ['gender'],
        where: { tenantId },
        _count: true,
      });
      return { reportId, name: report.name, data: result };
    }

    const result = await this.prisma.analyticsFactAppointment.groupBy({
      by: ['status'],
      where: { tenantId },
      _count: true,
    });
    return { reportId, name: report.name, data: result };
  }

  async scheduleReport(reportId: string, cronExpr: string, recipientEmails: string[]) {
    const tenantId = this.getTenantId();
    const report = await this.prisma.scheduledReport.findFirst({
      where: { id: reportId, tenantId },
    });

    if (!report) {
      throw new NotFoundException(`Report ${reportId} not found`);
    }

    return this.prisma.scheduledReport.update({
      where: { id: reportId },
      data: {
        scheduleCron: cronExpr,
        recipients: recipientEmails,
        status: 'ACTIVE',
      },
    });
  }
}
