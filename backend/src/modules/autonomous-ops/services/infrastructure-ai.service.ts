import { Injectable } from '@nestjs/common';

@Injectable()
export class InfrastructureAiService {
  async getAiRecommendations() {
    return [
      { id: 'rec-01', recommendation: 'Consolidate worker nodes on ap-south-1 due to low multi-tenant utilization', estimatedSavingsPct: 15, complexity: 'LOW' },
      { id: 'rec-02', recommendation: 'Enable Redis caching headers on reception-billing dimension schema models', estimatedSavingsPct: 8, complexity: 'LOW' },
      { id: 'rec-03', recommendation: 'Trigger dynamic JVM memory tuning limits on HL7 message streaming adapter', estimatedSavingsPct: 12, complexity: 'MEDIUM' },
    ];
  }
}