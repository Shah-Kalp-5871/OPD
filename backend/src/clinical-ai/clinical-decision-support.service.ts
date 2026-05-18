import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  SYMPTOM_RULES,
  DRUG_INTERACTIONS,
  VITAL_THRESHOLDS,
  IcdSuggestion,
} from './data/clinical-knowledge.data';
import { CdsRequestDto, CdsSuggestion, CdsResponse, AiOutcomeDto } from './dto/cds.dto';

const AI_DISCLAIMER =
  'These are AI-generated suggestions for clinical assistance only. ' +
  'They do not constitute a diagnosis. The treating doctor must independently ' +
  'evaluate and make all clinical decisions.';

@Injectable()
export class ClinicalDecisionSupportService {
  private readonly logger = new Logger(ClinicalDecisionSupportService.name);

  constructor(private readonly prisma: PrismaService) {}

  // ─── Primary Entry Point ────────────────────────────────────────────────

  async getSuggestions(dto: CdsRequestDto, requestingUserId: string): Promise<CdsResponse> {
    const { caseId, patientId, branchId, chiefComplaint, provisionalDiagnosis, prescribedDrugs } = dto;

    // Load patient allergies and history from DB in parallel
    const [allergies, patientHistory] = await Promise.all([
      this.prisma.patientAllergy.findMany({ where: { patientId } }),
      this.prisma.patientHistory.findFirst({ where: { patientId } }),
    ]);

    const suggestions: CdsSuggestion[] = [];

    // 1. ICD suggestions from chief complaint
    if (chiefComplaint) {
      const icdSuggestions = this.matchSymptoms(chiefComplaint);
      suggestions.push(...icdSuggestions);
    }

    // 2. Drug interaction checks
    if (prescribedDrugs && prescribedDrugs.length >= 2) {
      const interactionWarnings = this.checkDrugInteractions(prescribedDrugs);
      suggestions.push(...interactionWarnings);
    }

    // 3. Allergy conflict check
    if (prescribedDrugs && prescribedDrugs.length > 0 && allergies.length > 0) {
      const allergyConflicts = this.checkAllergyConflicts(prescribedDrugs, allergies);
      suggestions.push(...allergyConflicts);
    }

    // 4. Duplicate medication warning
    if (prescribedDrugs && prescribedDrugs.length > 0) {
      const duplicates = this.checkDuplicateMedications(prescribedDrugs);
      suggestions.push(...duplicates);
    }

    // 5. Chronic disease risk — from patient history (pastMedical + currentMedications)
    const chronicContext = [
      patientHistory?.pastMedical || '',
      patientHistory?.currentMedications || '',
    ].join(' ').trim();
    if (chronicContext) {
      const chronicWarnings = this.assessChronicRisk(
        chronicContext,
        prescribedDrugs || [],
      );
      suggestions.push(...chronicWarnings);
    }

    // Calculate overall confidence
    const overallConfidence =
      suggestions.length > 0
        ? Math.round(suggestions.reduce((sum, s) => sum + s.confidence, 0) / suggestions.length)
        : 0;

    // Audit log — immutable record of what was shown to the doctor
    const log = await this.prisma.aiSuggestionLog.create({
      data: {
        moduleType: 'CLINICAL_DECISION',
        entityType: 'PatientCase',
        entityId: caseId,
        inputContext: { chiefComplaint, provisionalDiagnosis, prescribedDrugs, patientId },
        suggestions: suggestions as any,
        confidenceScore: overallConfidence,
        outcome: 'SHOWN',
        reviewedById: requestingUserId,
        branchId,
      },
    });

    return {
      logId: log.id,
      patientId,
      caseId,
      overallConfidence,
      disclaimer: AI_DISCLAIMER,
      suggestions,
      generatedAt: new Date().toISOString(),
    };
  }

  // ─── Record Doctor Outcome ───────────────────────────────────────────────

  async recordOutcome(dto: AiOutcomeDto, userId: string): Promise<void> {
    await this.prisma.aiSuggestionLog.updateMany({
      where: { id: dto.logId },
      data: {
        outcome: dto.outcome,
        reviewedAt: new Date(),
        reviewedById: userId,
        reviewNotes: dto.reviewNotes,
      },
    });
    this.logger.log(`AI suggestion ${dto.logId} outcome: ${dto.outcome} by user ${userId}`);
  }

  // ─── Audit Log Access ────────────────────────────────────────────────────

  async getAuditLogs(branchId?: string, page = 1, limit = 50) {
    const skip = (page - 1) * limit;
    const where = branchId ? { branchId } : {};

    const [total, data] = await Promise.all([
      this.prisma.aiSuggestionLog.count({ where }),
      this.prisma.aiSuggestionLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          moduleType: true,
          entityType: true,
          entityId: true,
          confidenceScore: true,
          outcome: true,
          reviewedAt: true,
          reviewedById: true,
          createdAt: true,
          branchId: true,
        },
      }),
    ]);

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  // ─── Internal: Symptom Matching ─────────────────────────────────────────

  private matchSymptoms(complaint: string): CdsSuggestion[] {
    const lowerComplaint = complaint.toLowerCase();
    const results: CdsSuggestion[] = [];

    for (const rule of SYMPTOM_RULES) {
      const matchCount = rule.keywords.filter((kw) => lowerComplaint.includes(kw)).length;
      if (matchCount === 0) continue;

      const confidence = Math.min(95, Math.round((matchCount / rule.keywords.length) * 100) + 30);

      for (const s of rule.suggestions) {
        results.push({
          type: 'ICD_SUGGESTION',
          icd10Code: s.icd10Code,
          description: s.description,
          confidence,
          severity: 'INFO',
          details: {
            category: s.category,
            commonInvestigations: s.commonInvestigations,
            suggestedMedications: s.commonDrugs,
            recommendedFollowUpDays: s.followUpDays,
            matchedKeywords: rule.keywords.filter((kw) => lowerComplaint.includes(kw)),
          },
          actionable: true,
        });

        // Also push investigation suggestions
        if (s.commonInvestigations.length > 0) {
          results.push({
            type: 'INVESTIGATION',
            description: `Suggested investigations for ${s.description}`,
            confidence: Math.max(40, confidence - 10),
            severity: 'INFO',
            details: { investigations: s.commonInvestigations, forDiagnosis: s.icd10Code },
            actionable: true,
          });
        }
      }
    }

    // Deduplicate by icd10Code
    const seen = new Set<string>();
    return results.filter((r) => {
      const key = r.icd10Code || r.type + r.description;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  // ─── Internal: Drug Interaction Check ───────────────────────────────────

  private checkDrugInteractions(drugs: string[]): CdsSuggestion[] {
    const warnings: CdsSuggestion[] = [];
    const lowerDrugs = drugs.map((d) => d.toLowerCase());

    for (const interaction of DRUG_INTERACTIONS) {
      const drug1Match = lowerDrugs.some((d) =>
        interaction.drug1Keywords.some((kw) => d.includes(kw)),
      );
      const drug2Match = lowerDrugs.some((d) =>
        interaction.drug2Keywords.some((kw) => d.includes(kw)),
      );

      if (drug1Match && drug2Match) {
        const severity =
          interaction.severity === 'CONTRAINDICATED' || interaction.severity === 'SEVERE'
            ? 'CRITICAL'
            : interaction.severity === 'MODERATE'
              ? 'WARNING'
              : 'INFO';

        warnings.push({
          type: 'DRUG_INTERACTION',
          description: `⚠ Drug Interaction: ${interaction.drug1Keywords[0]} + ${interaction.drug2Keywords[0]}`,
          confidence: 90,
          severity,
          details: {
            drug1: interaction.drug1Keywords[0],
            drug2: interaction.drug2Keywords[0],
            interactionSeverity: interaction.severity,
            mechanism: interaction.mechanism,
            clinicalEffect: interaction.clinicalEffect,
            recommendation: interaction.recommendation,
          },
          actionable: true,
        });
      }
    }

    return warnings;
  }

  // ─── Internal: Allergy Conflict Check ───────────────────────────────────

  private checkAllergyConflicts(
    drugs: string[],
    allergies: { allergen: string; severity: string }[],
  ): CdsSuggestion[] {
    const conflicts: CdsSuggestion[] = [];

    for (const drug of drugs) {
      const lowerDrug = drug.toLowerCase();
      for (const allergy of allergies) {
        const lowerAllergen = allergy.allergen.toLowerCase();

        // Check if the drug name contains the allergen name or vice versa
        if (lowerDrug.includes(lowerAllergen) || lowerAllergen.includes(lowerDrug.split(' ')[0])) {
          conflicts.push({
            type: 'ALLERGY_CONFLICT',
            description: `🚨 ALLERGY ALERT: Patient is allergic to "${allergy.allergen}" — "${drug}" may conflict`,
            confidence: 95,
            severity: allergy.severity === 'CRITICAL' || allergy.severity === 'SEVERE' ? 'CRITICAL' : 'WARNING',
            details: {
              prescribedDrug: drug,
              allergen: allergy.allergen,
              allergySeverity: allergy.severity,
              action: 'DO NOT prescribe without explicit clinical justification and patient consent',
            },
            actionable: true,
          });
        }
      }
    }

    return conflicts;
  }

  // ─── Internal: Duplicate Medication Detection ────────────────────────────

  private checkDuplicateMedications(drugs: string[]): CdsSuggestion[] {
    const warnings: CdsSuggestion[] = [];
    const seen = new Map<string, string[]>();

    // Group by generic categories
    const categories: Record<string, string[]> = {
      nsaid: ['ibuprofen', 'diclofenac', 'naproxen', 'aspirin', 'ketorolac', 'celecoxib'],
      proton_pump: ['omeprazole', 'pantoprazole', 'rabeprazole', 'esomeprazole', 'lansoprazole'],
      antibiotic_penicillin: ['amoxicillin', 'ampicillin', 'cloxacillin', 'co-amoxiclav'],
      ssri: ['fluoxetine', 'sertraline', 'escitalopram', 'citalopram', 'paroxetine'],
      statin: ['atorvastatin', 'rosuvastatin', 'simvastatin', 'pravastatin'],
    };

    for (const [category, members] of Object.entries(categories)) {
      const matches = drugs.filter((drug) =>
        members.some((m) => drug.toLowerCase().includes(m)),
      );
      if (matches.length >= 2) {
        warnings.push({
          type: 'DRUG_INTERACTION',
          description: `Possible duplicate class: Multiple ${category.replace('_', ' ')} drugs prescribed`,
          confidence: 75,
          severity: 'WARNING',
          details: { category, duplicates: matches, recommendation: 'Review if both are clinically necessary' },
          actionable: true,
        });
      }
    }

    return warnings;
  }

  // ─── Internal: Chronic Disease Interaction ───────────────────────────────

  private assessChronicRisk(chronicDiseases: string, prescribedDrugs: string[]): CdsSuggestion[] {
    const warnings: CdsSuggestion[] = [];
    const lower = chronicDiseases.toLowerCase();
    const lowerDrugs = prescribedDrugs.map((d) => d.toLowerCase());

    // CKD + NSAIDs
    if ((lower.includes('ckd') || lower.includes('kidney') || lower.includes('renal')) &&
      lowerDrugs.some((d) => ['ibuprofen', 'diclofenac', 'naproxen'].some((n) => d.includes(n)))) {
      warnings.push({
        type: 'DRUG_INTERACTION',
        description: '⚠ Chronic Kidney Disease: NSAIDs may worsen renal function',
        confidence: 88,
        severity: 'CRITICAL',
        details: {
          condition: 'Chronic Kidney Disease',
          conflictingDrug: 'NSAID',
          risk: 'Acute kidney injury, fluid retention, electrolyte imbalance',
          recommendation: 'Use paracetamol. Avoid NSAIDs in CKD.',
        },
        actionable: true,
      });
    }

    // Diabetes + steroids
    if (lower.includes('diabetes') &&
      lowerDrugs.some((d) => ['prednisolone', 'dexamethasone', 'betamethasone', 'hydrocortisone'].some((n) => d.includes(n)))) {
      warnings.push({
        type: 'DRUG_INTERACTION',
        description: '⚠ Diabetes: Corticosteroids will elevate blood glucose',
        confidence: 85,
        severity: 'WARNING',
        details: {
          condition: 'Diabetes Mellitus',
          conflictingDrug: 'Corticosteroid',
          risk: 'Steroid-induced hyperglycemia',
          recommendation: 'Increase glucose monitoring. Adjust antidiabetic medication dose.',
        },
        actionable: true,
      });
    }

    // Liver disease + paracetamol high dose
    if ((lower.includes('hepatitis') || lower.includes('cirrhosis') || lower.includes('liver')) &&
      lowerDrugs.some((d) => d.includes('paracetamol'))) {
      warnings.push({
        type: 'DRUG_INTERACTION',
        description: '⚠ Liver Disease: Paracetamol dose must be reduced',
        confidence: 80,
        severity: 'WARNING',
        details: {
          condition: 'Liver Disease',
          conflictingDrug: 'Paracetamol',
          risk: 'Hepatotoxicity at standard doses',
          recommendation: 'Use max 2g/day in liver disease. Avoid alcohol.',
        },
        actionable: true,
      });
    }

    return warnings;
  }
}
