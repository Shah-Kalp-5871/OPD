import { Injectable } from '@nestjs/common';

@Injectable()
export class OpenTelemetryService {
  async getLatencyPercentiles() {
    return {
      p50Ms: 14,
      p90Ms: 42,
      p95Ms: 78,
      p99Ms: 145,
      activeExporter: 'otel-collector-agent.production:4317',
      totalTracesExportedToday: 489223,
    };
  }
}