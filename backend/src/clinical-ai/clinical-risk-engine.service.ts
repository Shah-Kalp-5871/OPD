import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { VITAL_THRESHOLDS } from './data/clinical-knowledge.data';
import { Severity } from '@prisma/client';

@Injectable()
export class ClinicalRiskEngineService {
  private readonly logger = new Logger(ClinicalRiskEngineService.name);

  constructor(private readonly prisma: PrismaService) {}

  // ─── Main: Evaluate patient risk after vitals/labs are recorded ───────

  async evaluatePatientRisk(patientId: string, branchId: string, caseId?: string): Promise<{
    flagsCreated: number;
    criticalAlerts: string[];
  }> {
    const [vitals, recentCases, allergies] = await Promise.all([
      this.prisma.patientVitals.findFirst({
        where: { patientId, ...(caseId ? { caseId } : {}) },
        orderBy: { takenAt: 'desc' },
      }),
      this.prisma.patientCase.findMany({
        where: { patientId },
        orderBy: { visitDate: 'desc' },
        take: 10,
        select: { visitType: true, visitDate: true, priority: true },
      }),
      this.prisma.patientAllergy.findMany({ where: { patientId } }),
    ]);

    const flags: { riskType: string; severity: Severity; description: string; details: object }[] = [];

    // 1. Abnormal vitals check
    if (vitals) {
      const vitalFlags = this.checkAbnormalVitals(vitals);
      flags.push(...vitalFlags);
    }

    // 2. Repeat emergency visits
    const emergencies = recentCases.filter((c) => c.priority === 'EMERGENCY');
    if (emergencies.length >= 3) {
      flags.push({
        riskType: 'REPEAT_EMERGENCY',
        severity: Severity.SEVERE,
        description: `Patient has ${emergencies.length} emergency visits in recent history`,
        details: { emergencyCount: emergencies.length, visits: emergencies },
      });
    }

    // 3. Unverified severe allergies
    const severeAllergies = allergies.filter(
      (a) => (a.severity === 'SEVERE' || a.severity === 'CRITICAL') && !a.isVerified,
    );
    if (severeAllergies.length > 0) {
      flags.push({
        riskType: 'ALLERGY_CONFLICT',
        severity: Severity.MODERATE,
        description: `${severeAllergies.length} unverified severe allergy/allergies on record`,
        details: { allergies: severeAllergies.map((a) => ({ allergen: a.allergen, severity: a.severity })) },
      });
    }

    // Persist new flags (avoid duplicates by checking last 24h)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    let flagsCreated = 0;
    const criticalAlerts: string[] = [];

    for (const flag of flags) {
      // Skip if same flag type was already created in last 24h for this patient
      const existing = await this.prisma.clinicalRiskFlag.findFirst({
        where: {
          patientId,
          riskType: flag.riskType,
          isResolved: false,
          createdAt: { gte: oneDayAgo },
        },
      });

      if (!existing) {
        await this.prisma.clinicalRiskFlag.create({
          data: {
            patientId,
            branchId,
            riskType: flag.riskType,
            severity: flag.severity,
            description: flag.description,
            details: flag.details as any,
          },
        });
        flagsCreated++;
        if (flag.severity === 'CRITICAL' || flag.severity === 'SEVERE') {
          criticalAlerts.push(flag.description);
        }
      }
    }

    if (flagsCreated > 0) {
      this.logger.warn(`Patient ${patientId}: ${flagsCreated} risk flag(s) created`);
    }

    return { flagsCreated, criticalAlerts };
  }

  // ─── Get Active Flags for a Patient ─────────────────────────────────────

  async getPatientRiskFlags(patientId: string) {
    return this.prisma.clinicalRiskFlag.findMany({
      where: { patientId, isResolved: false },
      orderBy: [{ severity: 'desc' }, { createdAt: 'desc' }],
    });
  }

  // ─── Acknowledge a Flag ──────────────────────────────────────────────────

  async acknowledgeFlag(flagId: string, userId: string): Promise<void> {
    await this.prisma.clinicalRiskFlag.update({
      where: { id: flagId },
      data: { isAcknowledged: true, acknowledgedById: userId, acknowledgedAt: new Date() },
    });
  }

  // ─── Branch-level Risk Summary ───────────────────────────────────────────

  async getBranchRiskSummary(branchId: string) {
    const [bySeverity, byType, recentCount] = await Promise.all([
      this.prisma.clinicalRiskFlag.groupBy({
        by: ['severity'],
        where: { branchId, isResolved: false },
        _count: { _all: true },
      }),
      this.prisma.clinicalRiskFlag.groupBy({
        by: ['riskType'],
        where: { branchId, isResolved: false },
        _count: { _all: true },
        orderBy: { _count: { riskType: 'desc' } },
        take: 5,
      }),
      this.prisma.clinicalRiskFlag.count({
        where: {
          branchId,
          isResolved: false,
          createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        },
      }),
    ]);

    return { bySeverity, byType, last24HoursCount: recentCount };
  }

  // ─── Internal: Vital Sign Analysis ──────────────────────────────────────

  private checkAbnormalVitals(vitals: {
    bloodPressure?: string | null;
    pulse?: number | null;
    temperature?: number | null;
    spo2?: number | null;
    bmi?: number | null;
  }): { riskType: string; severity: Severity; description: string; details: object }[] {
    const flags: { riskType: string; severity: Severity; description: string; details: object }[] = [];

    // Parse BP (format: "120/80")
    if (vitals.bloodPressure) {
      const parts = vitals.bloodPressure.split('/');
      if (parts.length === 2) {
        const systolic = parseInt(parts[0], 10);
        const diastolic = parseInt(parts[1], 10);
        const t = VITAL_THRESHOLDS;

        if (systolic >= t.systolicBP.critical_high || diastolic >= t.diastolicBP.critical_high) {
          flags.push({
            riskType: 'ABNORMAL_VITALS',
            severity: Severity.CRITICAL,
            description: `Hypertensive crisis: BP ${vitals.bloodPressure} mmHg`,
            details: { vital: 'bloodPressure', value: vitals.bloodPressure, threshold: 'critical_high' },
          });
        } else if (systolic >= t.systolicBP.high || diastolic >= t.diastolicBP.high) {
          flags.push({
            riskType: 'ABNORMAL_VITALS',
            severity: Severity.MODERATE,
            description: `Elevated BP: ${vitals.bloodPressure} mmHg`,
            details: { vital: 'bloodPressure', value: vitals.bloodPressure, threshold: 'high' },
          });
        } else if (systolic <= t.systolicBP.critical_low) {
          flags.push({
            riskType: 'ABNORMAL_VITALS',
            severity: Severity.CRITICAL,
            description: `Hypotensive crisis: BP ${vitals.bloodPressure} mmHg`,
            details: { vital: 'bloodPressure', value: vitals.bloodPressure, threshold: 'critical_low' },
          });
        }
      }
    }

    // SpO2
    if (vitals.spo2 != null) {
      const t = VITAL_THRESHOLDS.spo2;
      if (vitals.spo2 <= t.critical_low) {
        flags.push({
          riskType: 'ABNORMAL_VITALS',
          severity: Severity.CRITICAL,
          description: `Critical hypoxia: SpO2 ${vitals.spo2}%`,
          details: { vital: 'spo2', value: vitals.spo2, threshold: 'critical_low' },
        });
      } else if (vitals.spo2 < t.low) {
        flags.push({
          riskType: 'ABNORMAL_VITALS',
          severity: Severity.SEVERE,
          description: `Low oxygen saturation: SpO2 ${vitals.spo2}%`,
          details: { vital: 'spo2', value: vitals.spo2, threshold: 'low' },
        });
      }
    }

    // Pulse
    if (vitals.pulse != null) {
      const t = VITAL_THRESHOLDS.pulse;
      if (vitals.pulse <= t.critical_low || vitals.pulse >= t.critical_high) {
        flags.push({
          riskType: 'ABNORMAL_VITALS',
          severity: Severity.CRITICAL,
          description: `Critical pulse rate: ${vitals.pulse} bpm`,
          details: { vital: 'pulse', value: vitals.pulse },
        });
      }
    }

    // Temperature
    if (vitals.temperature != null) {
      const t = VITAL_THRESHOLDS.temperature;
      if (vitals.temperature >= t.critical_high) {
        flags.push({
          riskType: 'ABNORMAL_VITALS',
          severity: Severity.SEVERE,
          description: `High fever: Temp ${vitals.temperature}°C`,
          details: { vital: 'temperature', value: vitals.temperature },
        });
      } else if (vitals.temperature <= t.critical_low) {
        flags.push({
          riskType: 'ABNORMAL_VITALS',
          severity: Severity.SEVERE,
          description: `Hypothermia: Temp ${vitals.temperature}°C`,
          details: { vital: 'temperature', value: vitals.temperature },
        });
      }
    }

    return flags;
  }
}
