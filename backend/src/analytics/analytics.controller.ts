import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'SUPERADMIN')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard/stats')
  async getDashboardStats() {
    return this.analyticsService.getDashboardStats();
  }

  @Get('financial')
  async getFinancialAnalytics(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.analyticsService.getFinancialAnalytics(
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  @Get('clinical')
  async getClinicalAnalytics() {
    return this.analyticsService.getClinicalAnalytics();
  }

  @Get('inventory')
  async getInventoryAnalytics() {
    return this.analyticsService.getInventoryAnalytics();
  }

  @Get('audit')
  async getAuditAnalytics() {
    return this.analyticsService.getAuditAnalytics();
  }

  @Get('export/financial')
  async exportFinancialReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    const csv = await this.analyticsService.exportFinancialReport(
      new Date(startDate),
      new Date(endDate),
    );
    return { csv };
  }
}
