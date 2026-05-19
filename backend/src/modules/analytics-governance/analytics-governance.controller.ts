import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { TenantGuard } from '../tenancy/guards/tenant.guard';
import { AnalyticsExportService } from './analytics-export/analytics-export.service';
import { AnalyticsGovernanceService } from './analytics-governance/analytics-governance.service';

@Controller()
@UseGuards(JwtAuthGuard, TenantGuard)
export class AnalyticsGovernanceController {
  constructor(
    private readonly exportService: AnalyticsExportService,
    private readonly governanceService: AnalyticsGovernanceService,
  ) {}

  @Get('observability/analytics/reconciliation')
  async getReconciliation() {
    return this.governanceService.getReconciliationReport();
  }

  @Get('observability/analytics/performance')
  async getQueryPerformance() {
    return this.governanceService.getQueryPerformanceMetrics();
  }

  @Post('analytics/governance/exports')
  async requestExport(
    @Body() body: { userId: string; exportType: string; rawData: any[]; scope: string },
  ) {
    return this.exportService.requestExport(body.userId, body.exportType, body.rawData, body.scope);
  }

  @Get('analytics/governance/exports/audit')
  async getAuditTrail() {
    return this.exportService.getAuditTrail();
  }

  @Post('analytics/governance/exports/:id/approve')
  async approveExport(@Param('id') id: string, @Body() body: { approverId: string }) {
    return this.exportService.approveExport(id, body.approverId);
  }
}
