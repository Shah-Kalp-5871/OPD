import { Controller, Get, Post, Body, UseGuards, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { TenantGuard } from '../tenancy/guards/tenant.guard';
import { HealthGoalService } from './services/health-goal.service';
import { CarePlanService } from './services/care-plan.service';
import { WellnessTrackingService } from './services/wellness-tracking.service';

@Controller('wellness')
@UseGuards(JwtAuthGuard, TenantGuard)
export class WellnessController {
  constructor(
    private readonly healthGoalService: HealthGoalService,
    private readonly carePlanService: CarePlanService,
    private readonly trackingService: WellnessTrackingService,
  ) {}

  @Get('goals')
  async getGoals(@Query('patientId') patientId: string) {
    return this.healthGoalService.getGoals(patientId || 'default-patient');
  }

  @Post('goals/progress')
  async logGoalProgress(@Body() body: any) {
    return this.healthGoalService.logGoalProgress(
      body.patientId || 'default-patient',
      body.goalType,
      body.progress,
    );
  }

  @Get('care-plans')
  async getCarePlans(@Query('patientId') patientId: string) {
    return this.carePlanService.getCarePlans(patientId || 'default-patient');
  }

  @Get('metrics')
  async getMetrics(@Query('patientId') patientId: string) {
    return this.trackingService.getMetrics(patientId || 'default-patient');
  }

  @Post('metrics')
  async logMetric(@Body() body: any) {
    return this.trackingService.logMetric(
      body.patientId || 'default-patient',
      body.metricType,
      body.value,
      body.unit,
    );
  }
}