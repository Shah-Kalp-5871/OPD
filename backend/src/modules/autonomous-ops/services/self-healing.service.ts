import { Injectable } from '@nestjs/common';

@Injectable()
export class SelfHealingService {
  async getHealingEvents() {
    return [
      { timestamp: new Date(), action: 'POD_RESTART', reason: 'OutOfMemory threshold crossed', affectedAsset: 'analytics-aggregator-0aa91', status: 'MITIGATED' },
      { timestamp: new Date(), action: 'AUTO_SCALE_OUT', reason: 'High API request latency spikes (avg 180ms)', affectedAsset: 'medflow-api-core-hpa', status: 'MITIGATED' },
      { timestamp: new Date(), action: 'DNS_ANYCAST_FAILOVER', reason: 'Packet loss > 20% on secondary node', affectedAsset: 'ap-south-1-gateway', status: 'MITIGATED' },
    ];
  }
}