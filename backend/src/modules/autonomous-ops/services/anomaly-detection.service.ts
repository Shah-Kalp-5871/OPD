import { Injectable } from '@nestjs/common';

@Injectable()
export class AnomalyDetectionService {
  async getAnomalies() {
    return [
      { id: 'an-01', type: 'LATENCY_SPIKE', details: 'Database query execution delay spike observed on tenant replication replica', confidenceScore: 0.94 },
      { id: 'an-02', type: 'NETWORK_ERRORS', details: 'DDoS protection scrubbers throttled high frequency invalid geo lookup queries', confidenceScore: 0.88 },
    ];
  }
}