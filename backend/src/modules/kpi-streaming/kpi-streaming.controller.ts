import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { TenantGuard } from '../tenancy/guards/tenant.guard';
import { LiveAnalyticsService } from './live-analytics/live-analytics.service';

@Controller('analytics/live')
@UseGuards(JwtAuthGuard, TenantGuard)
export class KpiStreamingController {
  constructor(private readonly liveAnalytics: LiveAnalyticsService) {}

  @Get('kpis')
  async getLiveKpis(@Query('branchId') branchId?: string) {
    const kpis = await this.liveAnalytics.getLiveKpis(branchId);
    return { success: true, data: kpis };
  }
}
