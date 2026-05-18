import { Controller, Get, Post, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { InsuranceService, PreAuthRequest, ClaimRequest } from './insurance.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('insurance')
@UseGuards(JwtAuthGuard)
export class InsuranceController {
  constructor(private readonly insuranceService: InsuranceService) {}

  @Post('pre-auth/request')
  async requestPreAuth(@Body() body: Omit<PreAuthRequest, 'requestedBy'>, @Req() req: any) {
    const userId = req.user?.id || 'SYSTEM';
    return this.insuranceService.requestPreAuth({
      ...body,
      requestedBy: userId,
    });
  }

  @Post('pre-auth/review')
  async reviewPreAuth(
    @Body() body: { preAuthId: string; action: 'APPROVE' | 'REJECT'; remarks: string; approvedAmount?: number },
    @Req() req: any,
  ) {
    const reviewerId = req.user?.id || 'TPA_REVIEWER';
    return this.insuranceService.reviewPreAuth(
      body.preAuthId,
      body.action,
      reviewerId,
      body.remarks,
      body.approvedAmount,
    );
  }

  @Get('pre-auth/:id')
  async getPreAuth(@Param('id') id: string) {
    return this.insuranceService.getPreAuth(id);
  }

  @Get('split-bill/:billId/:policyId')
  async getSplitBilling(@Param('billId') billId: string, @Param('policyId') policyId: string) {
    return this.insuranceService.calculateSplitBilling(billId, policyId);
  }

  @Post('claims/generate')
  async generateClaim(@Body() body: ClaimRequest, @Req() req: any) {
    const userId = req.user?.id || 'SYSTEM';
    return this.insuranceService.generateClaim(body, userId);
  }

  @Get('claims/:id')
  async getClaim(@Param('id') id: string) {
    return this.insuranceService.getClaim(id);
  }

  @Get('claims/patient/:patientId')
  async getClaimsByPatient(@Param('patientId') patientId: string) {
    return this.insuranceService.getClaimsByPatient(patientId);
  }

  @Get('tpa/logs')
  async getTpaAuditLogs() {
    return this.insuranceService.getTpaAuditLogs();
  }
}
