import { Injectable } from '@nestjs/common';

@Injectable()
export class ErrorBudgetService {
  async getSloCompliance() {
    return {
      targetSlaPct: 99.9,
      currentCompliancePct: 99.985,
      remainingErrorBudgetHours: 4.82,
      budgetBurnRate: 1.0,
      windowDays: 30,
    };
  }
}