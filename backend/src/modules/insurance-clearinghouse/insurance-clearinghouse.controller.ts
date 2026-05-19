import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { TenantGuard } from '../tenancy/guards/tenant.guard';
import { ClaimRoutingService } from './services/claim-routing.service';
import { EligibilityVerificationService } from './services/eligibility-verification.service';
import { PriorAuthorizationService } from './services/prior-authorization.service';

@Controller('insurance-clearinghouse')
@UseGuards(JwtAuthGuard, TenantGuard)
export class InsuranceClearinghouseController {
  constructor(
    private readonly claimsService: ClaimRoutingService,
    private readonly eligibilityService: EligibilityVerificationService,
    private readonly priorAuthService: PriorAuthorizationService,
  ) {}

  @Post('claims/submit')
  async submitClaim(@Body() data: any) {
    return this.claimsService.submitClaim(data);
  }

  @Get('claims')
  async getClaims(@Query('status') status?: string) {
    return this.claimsService.getClaims(status);
  }

  @Post('claims/:id/process')
  async processClaim(@Param('id') id: string, @Body() data: any) {
    return this.claimsService.processClaim(id, data);
  }

  @Post('eligibility/verify')
  async verifyEligibility(@Body() data: any) {
    return this.eligibilityService.verifyEligibility(data);
  }

  @Get('eligibility/checks')
  async getEligibilityChecks() {
    return this.eligibilityService.getChecks();
  }

  @Post('prior-authorizations/request')
  async requestPriorAuth(@Body() data: any) {
    return this.priorAuthService.requestAuthorization(data);
  }

  @Get('prior-authorizations')
  async getPriorAuthorizations() {
    return this.priorAuthService.getAuthorizations();
  }

  @Post('prior-authorizations/:id/decide')
  async decidePriorAuth(@Param('id') id: string, @Body() data: any) {
    return this.priorAuthService.decideAuthorization(id, data);
  }
}
