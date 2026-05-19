import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { TenantGuard } from '../tenancy/guards/tenant.guard';
import { SavedReportService } from './saved-report/saved-report.service';
import { DashboardTemplateService } from './dashboard-template/dashboard-template.service';

@Controller('bi-analytics')
@UseGuards(JwtAuthGuard, TenantGuard)
export class BiAnalyticsController {
  constructor(
    private readonly reportService: SavedReportService,
    private readonly dashboardService: DashboardTemplateService,
  ) {}

  @Post('reports')
  async createReport(
    @Body() body: { reportName: string; description?: string; queryConfig: any; creatorId: string },
  ) {
    return this.reportService.createReport(body);
  }

  @Get('reports')
  async listReports() {
    return this.reportService.listReports();
  }

  @Post('reports/:id/execute')
  async executeReport(@Param('id') id: string) {
    return this.reportService.executeReport(id);
  }

  @Post('reports/:id/schedule')
  async scheduleReport(
    @Param('id') id: string,
    @Body() body: { cronSchedule: string; recipients: string[] },
  ) {
    return this.reportService.scheduleReport(id, body.cronSchedule, body.recipients);
  }

  @Post('dashboards')
  async createDashboard(
    @Body() body: { templateName: string; layoutConfig: any; isDefault?: boolean },
  ) {
    return this.dashboardService.createTemplate(body);
  }

  @Get('dashboards')
  async listDashboards() {
    return this.dashboardService.listTemplates();
  }

  @Get('dashboards/:id')
  async getDashboard(@Param('id') id: string) {
    return this.dashboardService.getTemplate(id);
  }
}
