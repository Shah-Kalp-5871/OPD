import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { TenantGuard } from '../tenancy/guards/tenant.guard';
import { RegionalComplianceEngine } from './services/regional-compliance.service';

@Controller('cross-border-governance')
@UseGuards(JwtAuthGuard, TenantGuard)
export class CrossBorderGovernanceController {
  constructor(private readonly complianceEngine: RegionalComplianceEngine) {}

  @Post('consent')
  async saveConsent(@Body() data: any) {
    return this.complianceEngine.saveConsent(data);
  }

  @Get('consents')
  async getConsents() {
    return this.complianceEngine.getConsents();
  }

  @Post('audits/residency')
  async logResidencyAudit(@Body() data: any) {
    return this.complianceEngine.logDataResidencyAudit(data);
  }

  @Get('audits/residency')
  async getResidencyAudits() {
    return this.complianceEngine.getResidencyAudits();
  }
}
