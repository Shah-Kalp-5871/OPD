import { Controller, Get, UseGuards } from '@nestjs/common';
import { ErpIntelligenceService } from './erp-intelligence.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { TenantGuard } from '../tenancy/guards/tenant.guard';

@UseGuards(JwtAuthGuard, TenantGuard)
@Controller('erp-intelligence')
export class ErpIntelligenceController {
  constructor(private readonly svc: ErpIntelligenceService) {}

  @Get('dashboard')
  getDashboard() { return this.svc.getExecutiveSummary(); }

  @Get('summary')
  getSummary() { return this.svc.getExecutiveSummary(); }
}
