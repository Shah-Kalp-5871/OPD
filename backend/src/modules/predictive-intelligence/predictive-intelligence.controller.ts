import { Controller, Post, Get, Param, Patch, Body, UseGuards } from '@nestjs/common';
import { PredictiveIntelligenceService } from './predictive-intelligence.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { TenantGuard } from '../tenancy/guards/tenant.guard';

@Controller('predictive-intelligence')
@UseGuards(JwtAuthGuard, TenantGuard)
export class PredictiveIntelligenceController {
  constructor(private readonly predictiveService: PredictiveIntelligenceService) {}

  @Post('patients/:patientId/calculate')
  async calculateRisk(@Param('patientId') patientId: string) {
    return this.predictiveService.calculateRiskProfile(patientId);
  }

  @Get('patients/:patientId')
  async getRiskProfile(@Param('patientId') patientId: string) {
    return this.predictiveService.getPatientRiskProfile(patientId);
  }

  @Patch('alerts/:alertId/resolve')
  async resolveAlert(
    @Param('alertId') alertId: string,
    @Body('resolvedById') resolvedById: string
  ) {
    return this.predictiveService.resolveAlert(alertId, resolvedById);
  }
}
