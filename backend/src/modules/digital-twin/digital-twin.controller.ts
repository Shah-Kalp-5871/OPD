import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { TenantGuard } from '../tenancy/guards/tenant.guard';
import { SimulationEngineService } from './services/simulation-engine.service';
import { CapacityForecastService } from './services/capacity-forecast.service';
import { PatientFlowSimulationService } from './services/patient-flow-simulation.service';

@Controller('digital-twin')
@UseGuards(JwtAuthGuard, TenantGuard)
export class DigitalTwinController {
  constructor(
    private readonly simEngine: SimulationEngineService,
    private readonly forecastService: CapacityForecastService,
    private readonly flowService: PatientFlowSimulationService,
  ) {}

  @Post('scenarios')
  async createScenario(@Body() data: any) {
    return this.simEngine.createScenario(data);
  }

  @Get('scenarios')
  async getScenarios() {
    return this.simEngine.getScenarios();
  }

  @Post('scenarios/:id/run')
  async runSimulation(@Param('id') id: string, @Body() data: any) {
    return this.simEngine.runSimulation(id, data);
  }

  @Get('runs')
  async getSimulationRuns(@Query('scenarioId') scenarioId?: string) {
    return this.simEngine.getSimulationRuns(scenarioId);
  }

  @Post('forecasts/generate')
  async generateForecasts(@Body() data: any) {
    return this.forecastService.generateForecasts(data.branchId);
  }

  @Get('forecasts')
  async getForecasts(@Query('type') type?: string) {
    return this.forecastService.getForecasts(type);
  }

  @Get('capacity-simulations')
  async getCapacitySimulations() {
    return this.forecastService.getCapacitySimulations();
  }

  @Get('events')
  async getEvents() {
    return this.flowService.getEvents();
  }

  @Get('recommendations')
  async getRecommendations() {
    return this.flowService.getRecommendations();
  }

  @Post('recommendations/:id/apply')
  async applyRecommendation(@Param('id') id: string) {
    return this.flowService.applyRecommendation(id);
  }
}
