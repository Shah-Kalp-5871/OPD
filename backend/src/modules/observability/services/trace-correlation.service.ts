import { Injectable } from '@nestjs/common';

@Injectable()
export class TraceCorrelationService {
  async searchTraces(limit: number = 10) {
    return [
      { traceId: 'tr-09a8bc43ff9921', service: 'medflow-gateway', durationMs: 142, statusCode: 200, timestamp: new Date() },
      { traceId: 'tr-91a13ffcae2b10', service: 'medflow-api-core', durationMs: 72, statusCode: 200, timestamp: new Date() },
      { traceId: 'tr-821cb91fae29c0', service: 'analytics-aggregator', durationMs: 1420, statusCode: 500, timestamp: new Date() },
    ].slice(0, limit);
  }
}