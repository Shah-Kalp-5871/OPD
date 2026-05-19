import { Injectable } from '@nestjs/common';

@Injectable()
export class KafkaStreamingService {
  async getKafkaStatus() {
    return {
      brokersCount: 3,
      controllerBroker: 'kafka-broker-01',
      totalTopics: 18,
      activeConsumers: 24,
      throughputMsgSec: 1480,
      queueLag: [
        { topic: 'medflow-clinical-vitals', lag: 0 },
        { topic: 'medflow-patient-billing', lag: 2 },
        { topic: 'medflow-audit-siem', lag: 0 },
      ],
    };
  }
}