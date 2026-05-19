import { Controller, Get, Post, Body, UseGuards, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { TenantGuard } from '../tenancy/guards/tenant.guard';
import { NpsAnalyticsService } from './services/nps-analytics.service';
import { SentimentAnalysisService } from './services/sentiment-analysis.service';

@Controller('experience')
@UseGuards(JwtAuthGuard, TenantGuard)
export class ExperienceController {
  constructor(
    private readonly npsService: NpsAnalyticsService,
    private readonly sentimentService: SentimentAnalysisService,
  ) {}

  @Get('nps')
  async getScores() {
    return this.npsService.getScores();
  }

  @Post('nps')
  async logNps(@Body() body: any) {
    return this.npsService.logNps(
      body.patientId || 'default-patient',
      body.score,
      body.feedbackText,
    );
  }

  @Get('incidents')
  async getIncidents() {
    return this.sentimentService.getIncidents();
  }

  @Post('incidents')
  async fileIncident(@Body() body: any) {
    return this.sentimentService.fileIncident(
      body.patientId || 'default-patient',
      body.complaintText,
    );
  }
}