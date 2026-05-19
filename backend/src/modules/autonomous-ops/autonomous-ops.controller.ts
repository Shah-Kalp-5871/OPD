import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { TenantGuard } from '../tenancy/guards/tenant.guard';
import { SelfHealingService } from './services/self-healing.service';
import { InfrastructureAiService } from './services/infrastructure-ai.service';
import { CapacityForecastService } from './services/capacity-forecast.service';
import { AnomalyDetectionService } from './services/anomaly-detection.service';
import { OperationalOptimizationService } from './services/operational-optimization.service';
import { AiDecisionService } from './services/ai-decision.service';
import { AutonomousEscalationService } from './services/autonomous-escalation.service';

@Controller('autonomous-ops')
@UseGuards(JwtAuthGuard, TenantGuard)
export class AutonomousOpsController {
  constructor(
    private readonly selfHealing: SelfHealingService,
    private readonly ai: InfrastructureAiService,
    private readonly capacity: CapacityForecastService,
    private readonly anomaly: AnomalyDetectionService,
    private readonly optimizationService: OperationalOptimizationService,
    private readonly decisionService: AiDecisionService,
    private readonly escalationService: AutonomousEscalationService,
  ) {}

  @Get('healing')
  async getHealing() {
    return this.selfHealing.getHealingEvents();
  }

  @Get('ai-insights')
  async getAiInsights() {
    return this.ai.getAiRecommendations();
  }

  @Get('capacity')
  async getCapacity() {
    return this.capacity.getForecasts();
  }

  @Get('anomalies')
  async getAnomalies() {
    return this.anomaly.getAnomalies();
  }

  @Get('policies')
  async getPolicies() {
    return this.optimizationService.getOptimizationPolicies();
  }

  @Post('policies/:id')
  async updatePolicy(@Param('id') id: string, @Body() data: any) {
    return this.optimizationService.updatePolicy(id, data);
  }

  @Get('workflows')
  async getWorkflows() {
    return this.optimizationService.getWorkflowExecutions();
  }

  @Post('workflows/trigger')
  async triggerWorkflow(@Body() data: any) {
    return this.optimizationService.triggerOptimizationWorkflow(data.name, data.triggerEvent);
  }

  @Post('decisions')
  async createDecision(@Body() data: any) {
    return this.decisionService.createDecision(data);
  }

  @Get('decisions')
  async getDecisions(@Query('status') status?: string) {
    return this.decisionService.getDecisions(status);
  }

  @Post('decisions/:id/decide')
  async decideAction(@Param('id') id: string, @Body() data: any) {
    return this.decisionService.decideAction(id, data.action, data.userId);
  }

  @Get('directives')
  async getDirectives() {
    return this.decisionService.getDirectives();
  }

  @Post('escalations')
  async createEscalation(@Body() data: any) {
    return this.escalationService.createEscalation(data);
  }

  @Get('escalations')
  async getEscalations() {
    return this.escalationService.getEscalations();
  }

  @Post('escalations/:id/resolve')
  async resolveEscalation(@Param('id') id: string) {
    return this.escalationService.resolveEscalation(id);
  }
}