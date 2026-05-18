import { IsString, IsOptional, IsEnum } from 'class-validator';

export class CdsRequestDto {
  @IsString()
  caseId: string;

  @IsString()
  patientId: string;

  @IsString()
  branchId: string;

  @IsOptional()
  @IsString()
  chiefComplaint?: string;

  @IsOptional()
  @IsString()
  provisionalDiagnosis?: string;

  /** Current drugs in the prescription (drug names) */
  @IsOptional()
  prescribedDrugs?: string[];
}

export class AiOutcomeDto {
  @IsString()
  logId: string;

  @IsEnum(['ACCEPTED', 'MODIFIED', 'REJECTED', 'IGNORED'])
  outcome: 'ACCEPTED' | 'MODIFIED' | 'REJECTED' | 'IGNORED';

  @IsOptional()
  @IsString()
  reviewNotes?: string;
}

export interface CdsSuggestion {
  type: 'ICD_SUGGESTION' | 'INVESTIGATION' | 'DRUG_INTERACTION' | 'ALLERGY_CONFLICT' | 'FOLLOWUP';
  icd10Code?: string;
  description: string;
  confidence: number;
  severity?: 'INFO' | 'WARNING' | 'CRITICAL';
  details?: Record<string, any>;
  actionable: boolean;
}

export interface CdsResponse {
  logId: string;
  patientId: string;
  caseId: string;
  overallConfidence: number;
  disclaimer: string;
  suggestions: CdsSuggestion[];
  generatedAt: string;
}
