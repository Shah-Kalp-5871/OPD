import {
  IsString,
  IsArray,
  IsOptional,
  IsBoolean,
  IsEnum,
  IsNumber,
  ValidateNested,
  IsNotEmpty,
  IsUUID,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateInvestigationOrderDto {
  @IsUUID()
  id: string; // LabParameter ID

  @IsBoolean()
  @IsOptional()
  urgent?: boolean;
}

export class CreateInvestigationBatchDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateInvestigationOrderDto)
  orders: CreateInvestigationOrderDto[];
}

export class PrescriptionItemDto {
  @IsUUID()
  @IsOptional()
  drugId?: string;

  @IsString()
  @IsNotEmpty()
  drugName: string;

  @IsString()
  @IsNotEmpty()
  dosage: string;

  @IsString()
  @IsNotEmpty()
  frequency: string;

  @IsNumber()
  @Min(1)
  duration: number;

  @IsString()
  @IsOptional()
  route?: string;

  @IsString()
  @IsOptional()
  instructions?: string;
}

export class CreatePrescriptionDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PrescriptionItemDto)
  items: PrescriptionItemDto[];

  @IsString()
  @IsOptional()
  notes?: string;
}

export class CreateProcedureSessionDto {
  @IsUUID()
  procedureId: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsBoolean()
  @IsOptional()
  isCompletedByDoctor?: boolean;

  @IsString()
  @IsOptional()
  scheduledDate?: string;

  @IsString()
  @IsOptional()
  scheduledTime?: string;

  @IsNumber()
  @IsOptional()
  sessions?: number;
}

export class ComplaintUpdateDto {
  @IsString()
  @IsOptional()
  chiefComplaint?: string;

  @IsNumber()
  @IsOptional()
  duration?: number;

  @IsString()
  @IsOptional()
  durationType?: string;

  @IsString()
  @IsOptional()
  severity?: string;

  @IsString()
  @IsOptional()
  onset?: string;

  @IsString()
  @IsOptional()
  aggravatingFactors?: string;

  @IsString()
  @IsOptional()
  relievingFactors?: string;

  @IsString()
  @IsOptional()
  presentIllness?: string;
}

export class ClinicalHistoryUpdateDto {
  @IsString()
  @IsOptional()
  pastHistory?: string;

  @IsString()
  @IsOptional()
  personalHistory?: string;

  @IsString()
  @IsOptional()
  surgicalHistory?: string;

  @IsString()
  @IsOptional()
  familyHistory?: string;

  @IsString()
  @IsOptional()
  obstetricHistory?: string;

  @IsString()
  @IsOptional()
  allergies?: string;

  @IsString()
  @IsOptional()
  chronicDiseases?: string;

  @IsString()
  @IsOptional()
  nursingNotes?: string;

  @IsString()
  @IsOptional()
  patientFeedback?: string;

  @IsString()
  @IsOptional()
  currentMedications?: string;
}

export class VitalsUpdateDto {
  @IsNumber()
  @IsOptional()
  height?: number;

  @IsNumber()
  @IsOptional()
  weight?: number;

  @IsNumber()
  @IsOptional()
  bmi?: number;

  @IsString()
  @IsOptional()
  bloodPressure?: string;

  @IsNumber()
  @IsOptional()
  pulse?: number;

  @IsNumber()
  @IsOptional()
  temperature?: number;

  @IsNumber()
  @IsOptional()
  spo2?: number;
}

export class UpdateConsultationDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => ComplaintUpdateDto)
  complaint?: ComplaintUpdateDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => ClinicalHistoryUpdateDto)
  history?: ClinicalHistoryUpdateDto;

  @IsString()
  @IsOptional()
  provisionalDiagnosis?: string;

  @IsString()
  @IsOptional()
  differentialDiagnosis?: string;

  @IsString()
  @IsOptional()
  finalDiagnosis?: string;

  @IsString()
  @IsOptional()
  treatmentPlan?: string;

  @IsString()
  @IsOptional()
  advice?: string;

  @IsString()
  @IsOptional()
  nextVisitDate?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => VitalsUpdateDto)
  vitals?: VitalsUpdateDto;
}

export class FinalizeConsultationDto {
  @IsEnum(['NURSING', 'DOCTOR', 'BILLING', 'PHARMACY', 'COMPLETED'])
  nextStage: string;
}
