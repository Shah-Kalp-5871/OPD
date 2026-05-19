import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class CanaryReleaseService {
  private readonly logger = new Logger(CanaryReleaseService.name);

  async getCanaryStatus() {
    return {
      activeCanary: true,
      stableVersion: 'v1.41.2',
      canaryVersion: 'v1.42.0-rc2',
      trafficSplitWeightPct: 10,
      errorRatioCanary: 0.0002,
      errorRatioStable: 0.0001,
      promotionStatus: 'MONITORING_CANARY_STABILITY', // PROMOTED, DEPLOYING, RETRACTED
      healthScore: 99.4,
    };
  }

  async setCanaryWeight(weight: number) {
    this.logger.log(`Setting canary routing weight to: ${weight}%`);
    return { success: true, updatedWeight: weight };
  }
}