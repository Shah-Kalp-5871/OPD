import { Injectable } from '@nestjs/common';

@Injectable()
export class AutoScalingService {
  async getHpaStatus() {
    return {
      hpaConfigured: true,
      minReplicas: 3,
      maxReplicas: 15,
      currentReplicas: 5,
      cpuThresholdPct: 75,
      memoryThresholdPct: 80,
      recentScalingEvents: [
        { timestamp: new Date(), action: 'SCALE_UP', replicasFrom: 3, replicasTo: 5, triggerMetric: 'CPU workload exceeded 78%' },
      ],
    };
  }
}