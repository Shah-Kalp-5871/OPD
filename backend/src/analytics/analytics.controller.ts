import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { PaginationDto } from '../common/dto/pagination.dto';

@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SUPERADMIN', 'BRANCH_ADMIN', 'CLINIC_MANAGER', 'CENTRAL_FINANCE', 'CENTRAL_PHARMACY')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard/stats')
  async getDashboardStats() {
    return this.analyticsService.getDashboardStats();
  }

  @Get('enterprise/branch-comparison')
  @Roles('SUPERADMIN', 'CENTRAL_FINANCE')
  async getEnterpriseBranchComparison(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.analyticsService.getEnterpriseBranchComparison(
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
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
  async getAuditAnalytics(@Query() paginationDto: PaginationDto) {
    const { page = 1, limit = 50 } = paginationDto || {};
    return this.analyticsService.getAuditAnalytics(page, limit);
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
