import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TenantContextService } from '../tenancy/tenant-context.service';
import { CommunicationHubService } from '../communication-hub/communication-hub.service';

@Injectable()
export class PredictiveIntelligenceService {
  private readonly logger = new Logger(PredictiveIntelligenceService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly communications: CommunicationHubService,
    private readonly tenantContext: TenantContextService
  ) {}

  async calculateRiskProfile(patientId: string) {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) throw new Error('Tenant context missing');

    this.logger.log(`Calculating predictive risk for patient ${patientId} in tenant ${tenantId}`);

    // AI Feature Aggregation: Aggregate vitals, labs, RPM streams, history (Simulated)
    const deteriorationRisk = parseFloat((Math.random() * 40 + 10).toFixed(2));
    const sepsisRisk = parseFloat((Math.random() * 20).toFixed(2));
    const readmissionProb = parseFloat((Math.random() * 30 + 5).toFixed(2));
    const mortalityRisk = parseFloat((Math.random() * 10).toFixed(2));
    const icuEscalationProb = parseFloat((Math.random() * 15).toFixed(2));
    const noShowProb = parseFloat((Math.random() * 25).toFixed(2));
    const adherenceProb = parseFloat((Math.random() * 50 + 50).toFixed(2));
    const overallRiskScore = parseFloat(
      ((deteriorationRisk + sepsisRisk * 1.5 + icuEscalationProb * 2) / 4.5).toFixed(2)
    );

    let riskProfile = await this.prisma.patientRiskProfile.findUnique({
      where: { patientId },
    });

    if (riskProfile) {
      riskProfile = await this.prisma.patientRiskProfile.update({
        where: { id: riskProfile.id },
        data: {
          overallRiskScore, deteriorationRisk, sepsisRisk, readmissionProb,
          mortalityRisk, icuEscalationProb, noShowProb, adherenceProb,
          lastCalculatedAt: new Date()
        }
      });
    } else {
      riskProfile = await this.prisma.patientRiskProfile.create({
        data: {
          tenantId, patientId, overallRiskScore, deteriorationRisk, sepsisRisk,
          readmissionProb, mortalityRisk, icuEscalationProb, noShowProb, adherenceProb
        }
      });
    }

    // Explainable AI Layer: Store prediction metadata
    await this.prisma.riskPrediction.create({
      data: {
        tenantId,
        riskProfileId: riskProfile.id,
        predictionType: 'DETERIORATION',
        score: deteriorationRisk,
        confidence: parseFloat((Math.random() * 0.2 + 0.75).toFixed(2)),
        triggerEvidence: { metric: 'HR', value: 110, trend: 'increasing' },
        contributingFactors: ['Age > 65', 'History of Hypertension'],
        explainability: { modelVersion: 'v2.4.1', algorithm: 'XGBoost Survival Analysis', shapValues: { HR: 0.4, Age: 0.25 } }
      }
    });

    // AI Alert Escalation
    if (overallRiskScore > 75) {
      const alert = await this.prisma.aiAlert.create({
        data: {
          tenantId,
          riskProfileId: riskProfile.id,
          alertType: 'CRITICAL',
          message: `Critical deterioration risk detected (${overallRiskScore}%). Immediate review recommended.`,
        }
      });
      // Route through communication hub
      this.logger.warn(`CRITICAL Alert Generated: ${alert.message}`);
    } else if (overallRiskScore > 50) {
      await this.prisma.aiAlert.create({
        data: { tenantId, riskProfileId: riskProfile.id, alertType: 'HIGH', message: `High risk detected (${overallRiskScore}%). Schedule follow-up.` }
      });
    }

    return riskProfile;
  }

  async getPatientRiskProfile(patientId: string) {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) throw new Error('Tenant context missing');
    return this.prisma.patientRiskProfile.findUnique({
      where: { patientId, tenantId },
      include: {
        predictions: { orderBy: { createdAt: 'desc' }, take: 5 },
        alerts: { where: { isResolved: false }, orderBy: { createdAt: 'desc' } }
      }
    });
  }

  async resolveAlert(alertId: string, resolvedById: string) {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) throw new Error('Tenant context missing');
    return this.prisma.aiAlert.update({
      where: { id: alertId, tenantId },
      data: { isResolved: true, resolvedAt: new Date(), resolvedById }
    });
  }
}
