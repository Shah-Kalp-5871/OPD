import { Injectable } from '@nestjs/common';

@Injectable()
export class CapacityForecastService {
  async getForecasts() {
    return {
      daysToSaturationCpu: 42,
      daysToSaturationMemory: 18,
      recommendedBufferIncreaseReplicas: 3,
      predictedRpsPeak: 280,
      predictedRpsPeakDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    };
  }
}