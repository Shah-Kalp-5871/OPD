import { Injectable } from '@nestjs/common';

@Injectable()
export class SreMonitoringService {
  async getGoldenSignals() {
    return {
      latencyMs: 18.4,
      trafficRps: 184.2,
      errorsCount: 4,
      saturationCpuPct: 32.1,
      saturationMemoryPct: 54.8,
    };
  }
}