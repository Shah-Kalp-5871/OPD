import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { TenantGuard } from '../tenancy/guards/tenant.guard';
import { CareJourneyService } from './services/care-journey.service';
import { RiskNavigationEngineService } from './services/risk-navigation-engine.service';
import { ClinicalPathwayOptimizerService } from './services/clinical-pathway-optimizer.service';

@Controller('clinical-navigation')
@UseGuards(JwtAuthGuard, TenantGuard)
export class ClinicalNavigationController {
  constructor(
    private readonly careJourneyService: CareJourneyService,
    private readonly riskEngine: RiskNavigationEngineService,
    private readonly optimizer: ClinicalPathwayOptimizerService,
  ) {}

  @Post('journeys')
  async createJourney(@Body() data: any) {
    return this.careJourneyService.createJourney(data);
  }

  @Get('journeys')
  async getJourneys(@Query('patientId') patientId?: string) {
    return this.careJourneyService.getJourneys(patientId);
  }

  @Post('journeys/:id/stage')
  async updateJourneyStage(@Param('id') id: string, @Body() data: any) {
    return this.careJourneyService.updateJourneyStage(id, data.stage, data.progressPct);
  }

  @Post('milestones/:id/complete')
  async completeMilestone(@Param('id') id: string) {
    return this.careJourneyService.completeMilestone(id);
  }

  @Get('signals')
  async getRiskSignals(@Query('patientId') patientId?: string) {
    return this.riskEngine.getRiskSignals(patientId);
  }

  @Post('signals/:id/address')
  async addressSignal(@Param('id') id: string) {
    return this.riskEngine.addressSignal(id);
  }

  @Get('recommendations')
  async getRecommendations(@Query('patientId') patientId?: string) {
    return this.optimizer.getRecommendations(patientId);
  }

  @Post('recommendations/:id/dismiss')
  async dismissRecommendation(@Param('id') id: string) {
    return this.optimizer.dismissRecommendation(id);
  }
}
