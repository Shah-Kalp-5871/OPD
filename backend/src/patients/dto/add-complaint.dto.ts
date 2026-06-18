import { IsString, IsOptional, IsNumber, IsEnum, IsUUID } from 'class-validator';

export class AddComplaintDto {
  @IsUUID()
  @IsOptional()
  caseId?: string;

  @IsString()
  @IsOptional()
  presentComplaint?: string;

  @IsNumber()
  @IsOptional()
  durationDays?: number;

  @IsNumber()
  @IsOptional()
  durationMonths?: number;

  @IsNumber()
  @IsOptional()
  durationYears?: number;

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
  pastMedical?: string;

  @IsString()
  @IsOptional()
  personalHistory?: string;

  @IsString()
  @IsOptional()
  pastSurgical?: string;

  @IsString()
  @IsOptional()
  currentMedications?: string;

  @IsString()
  @IsOptional()
  obstetricHistory?: string;

  @IsString()
  @IsOptional()
  allergies?: string;

  @IsString()
  @IsOptional()
  nursingNotes?: string;

  @IsString()
  @IsOptional()
  patientFeedback?: string;
}
