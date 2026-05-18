import { Controller, Post, Get, Param, UseGuards } from '@nestjs/common';
import { FinancialIntelligenceService } from './financial-intelligence.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { TenantGuard } from '../tenancy/guards/tenant.guard';

@Controller('financial-intelligence')
@UseGuards(JwtAuthGuard, TenantGuard)
export class FinancialIntelligenceController {
  constructor(private readonly financeService: FinancialIntelligenceService) {}

  @Post('forecast/:month')
  async triggerForecast(@Param('month') month: string) {
    return this.financeService.generateRevenueForecast(month);
  }

  @Post('fraud/sweep')
  async triggerFraudSweep() {
    return this.financeService.runFraudDetectionSweep();
  }

  @Get('dashboard')
  async getDashboard() {
    return this.financeService.getDashboardData();
  }
}
