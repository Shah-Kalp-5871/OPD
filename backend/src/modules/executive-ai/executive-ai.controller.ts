import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { TenantGuard } from '../tenancy/guards/tenant.guard';
import { ExecutiveInsightService } from './executive-insight/executive-insight.service';

@Controller('executive-ai')
@UseGuards(JwtAuthGuard, TenantGuard)
export class ExecutiveAiController {
  constructor(private readonly insightService: ExecutiveInsightService) {}

  @Get('insights')
  async getInsights() {
    return this.insightService.getExecutiveInsights();
  }
}
