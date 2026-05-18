import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TenantContextService } from '../tenancy/tenant-context.service';

@Injectable()
export class FinancialIntelligenceService {
  private readonly logger = new Logger(FinancialIntelligenceService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContext: TenantContextService
  ) {}

  async generateRevenueForecast(month: string) {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) throw new Error('Tenant context missing');
    if (!tenantId) throw new Error('Tenant context missing');

    this.logger.log(`Generating financial forecast for ${month}`);

    // Simulated AI Forecasting Logic
    const baseRev = Math.random() * 500000 + 100000;
    const predictedRevenue = parseFloat(baseRev.toFixed(2));
    const confidenceBoundLower = parseFloat((baseRev * 0.9).toFixed(2));
    const confidenceBoundUpper = parseFloat((baseRev * 1.1).toFixed(2));

    const forecast = await this.prisma.revenueForecast.upsert({
      where: { tenantId_month: { tenantId, month } },
      update: {
        predictedRevenue,
        confidenceBoundLower,
        confidenceBoundUpper,
        keyDrivers: { "telemedicine_volume": "+12%", "chronic_care_billing": "+8%", "seasonality": "-3%" },
        generatedAt: new Date(),
      },
      create: {
        tenantId,
        month,
        predictedRevenue,
        confidenceBoundLower,
        confidenceBoundUpper,
        keyDrivers: { "telemedicine_volume": "+12%", "chronic_care_billing": "+8%", "seasonality": "-3%" },
      }
    });

    return forecast;
  }

  async runFraudDetectionSweep() {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) throw new Error('Tenant context missing');
    this.logger.log(`Running Anomaly & Fraud Detection sweep...`);

    // Simulated AI Fraud Detection
    const anomalies = [
      { type: 'UPCODING', score: 85, evidence: { "cptCode": "99215", "avgTime": "8m", "flag": "Level 5 visit mapped to 8m encounter" } },
      { type: 'DUPLICATE_CLAIM', score: 92, evidence: { "patient": "P-101", "service": "X-Ray", "flag": "Billed twice in 48h without justification" } }
    ];

    for (const anomaly of anomalies) {
      await this.prisma.fraudAlert.create({
        data: {
          tenantId,
          alertType: anomaly.type,
          riskScore: anomaly.score,
          evidence: anomaly.evidence,
          status: 'INVESTIGATING'
        }
      });
    }

    return { message: `Sweep complete. Detected ${anomalies.length} potential anomalies.` };
  }

  async getDashboardData() {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) throw new Error('Tenant context missing');
    
    // Get latest forecast (mocking current month)
    const month = new Date().toISOString().substring(0, 7);
    const forecast = await this.prisma.revenueForecast.findUnique({
      where: { tenantId_month: { tenantId, month } }
    });

    const activeAlerts = await this.prisma.fraudAlert.findMany({
      where: { tenantId, status: 'INVESTIGATING' },
      orderBy: { riskScore: 'desc' },
      take: 10
    });

    return { forecast, activeAlerts };
  }
}
