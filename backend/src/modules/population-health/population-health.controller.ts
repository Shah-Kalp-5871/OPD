import { Controller, Post, Get, Param, UseGuards } from '@nestjs/common';
import { PopulationHealthService } from './population-health.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { TenantGuard } from '../tenancy/guards/tenant.guard';

@Controller('population-health')
@UseGuards(JwtAuthGuard, TenantGuard)
export class PopulationHealthController {
  constructor(private readonly popHealthService: PopulationHealthService) {}

  @Post('hotspots/scan/:region')
  async scanRegion(@Param('region') region: string) {
    return this.popHealthService.detectHotspots(region);
  }

  @Post('cohort/analyze/:cohort')
  async analyzeCohort(@Param('cohort') cohort: string) {
    return this.popHealthService.analyzeCohortRisk(cohort);
  }

  @Get('dashboard')
  async getDashboard() {
    return this.popHealthService.getDashboardData();
  }
}
