import { Controller, Get, Post, Body, Param, Query, Patch } from '@nestjs/common';
import { GlobalTelemetryService } from './services/global-telemetry.service';
import { SystemOrchestrationService } from './services/system-orchestration.service';
import { ExecutiveCommandService } from './services/executive-command.service';
import { RegionalOperationsService } from './services/regional-operations.service';
import { CrossModuleCoordinatorService } from './services/cross-module-coordinator.service';
import { QuantumOptimizationService } from './services/quantum-optimization.service';

@Controller('global-command-center')
export class GlobalCommandCenterController {
  constructor(
    private readonly telemetryService: GlobalTelemetryService,
    private readonly orchestrationService: SystemOrchestrationService,
    private readonly executiveService: ExecutiveCommandService,
    private readonly regionalService: RegionalOperationsService,
    private readonly coordinatorService: CrossModuleCoordinatorService,
    private readonly quantumService: QuantumOptimizationService,
  ) {}

  // 1. Telemetry
  @Get('telemetry/snapshot')
  async getTelemetrySnapshot(@Query('branchId') branchId?: string) {
    return this.telemetryService.getTelemetrySnapshot(branchId);
  }

  @Get('telemetry/history')
  async getTelemetryHistory() {
    return this.telemetryService.getTelemetryHistory();
  }

  // 2. System Orchestration
  @Get('infrastructure/status')
  async getInfrastructureStatus() {
    return this.orchestrationService.getInfrastructureStatus();
  }

  @Post('infrastructure/failover/:nodeId')
  async triggerFailover(@Param('nodeId') nodeId: string) {
    return this.orchestrationService.triggerEmergencyFailover(nodeId);
  }

  // 3. Executive Overview & Incidents
  @Get('executive/overview')
  async getExecutiveOverview() {
    return this.executiveService.getExecutiveOverview();
  }

  @Post('incidents/:id/resolve')
  async resolveIncident(@Param('id') id: string, @Body() data: { resolution: string }) {
    return this.executiveService.resolveIncident(id, data.resolution);
  }

  // 4. Regional Metrics
  @Get('regional/throughput')
  async getRegionalThroughput() {
    return this.regionalService.getRegionalThroughput();
  }

  // 5. Cross-Module Coordination & Timeline
  @Get('integrated/insights')
  async getIntegratedInsights() {
    return this.coordinatorService.getIntegratedInsights();
  }

  @Get('timeline')
  async getTimeline(
    @Query('type') type?: string,
    @Query('region') region?: string,
    @Query('severity') severity?: string,
  ) {
    return this.coordinatorService.getTimelineEvents(type, region, severity);
  }

  @Post('timeline/event')
  async createTimelineEvent(
    @Body() data: { type: string; message: string; severity?: string },
  ) {
    return this.coordinatorService.createIntegratedTimelineEvent(
      data.type,
      data.message,
      data.severity,
    );
  }

  // 6. Quantum Optimization
  @Post('quantum/optimize')
  async triggerQuantumOptimization(@Query('simulate') simulate?: string) {
    return this.quantumService.runOptimizationEngine(simulate === 'true');
  }

  @Get('quantum/recommendations')
  async getQuantumRecommendations() {
    return this.quantumService.getActiveRecommendations();
  }

  @Patch('quantum/recommendations/:id/apply')
  async applyQuantumRecommendation(@Param('id') id: string) {
    return this.quantumService.applyRecommendation(id);
  }
}
