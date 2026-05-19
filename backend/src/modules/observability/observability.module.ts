import { Module } from '@nestjs/common';
import { ObservabilityController } from './observability.controller';
import { OpenTelemetryService } from './services/open-telemetry.service';
import { TraceCorrelationService } from './services/trace-correlation.service';
import { SreMonitoringService } from './services/sre-monitoring.service';
import { ErrorBudgetService } from './services/error-budget.service';
import { TenancyModule } from '../tenancy/tenancy.module';

@Module({
  imports: [TenancyModule],
  controllers: [ObservabilityController],
  providers: [
    OpenTelemetryService,
    TraceCorrelationService,
    SreMonitoringService,
    ErrorBudgetService,
  ],
  exports: [
    OpenTelemetryService,
    TraceCorrelationService,
    SreMonitoringService,
    ErrorBudgetService,
  ],
})
export class ObservabilityModule {}