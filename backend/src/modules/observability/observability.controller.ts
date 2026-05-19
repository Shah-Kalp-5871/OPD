import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { TenantGuard } from '../tenancy/guards/tenant.guard';
import { OpenTelemetryService } from './services/open-telemetry.service';
import { TraceCorrelationService } from './services/trace-correlation.service';
import { SreMonitoringService } from './services/sre-monitoring.service';
import { ErrorBudgetService } from './services/error-budget.service';

@Controller('observability')
@UseGuards(JwtAuthGuard, TenantGuard)
export class ObservabilityController {
  constructor(
    private readonly otel: OpenTelemetryService,
    private readonly trace: TraceCorrelationService,
    private readonly sre: SreMonitoringService,
    private readonly budget: ErrorBudgetService,
  ) {}

  @Get('metrics/percentiles')
  async getPercentiles() {
    return this.otel.getLatencyPercentiles();
  }

  @Get('traces')
  async getTraces(@Query('limit') limit?: number) {
    return this.trace.searchTraces(limit ? Number(limit) : 10);
  }

  @Get('golden-signals')
  async getSignals() {
    return this.sre.getGoldenSignals();
  }

  @Get('error-budget')
  async getBudget() {
    return this.budget.getSloCompliance();
  }
}