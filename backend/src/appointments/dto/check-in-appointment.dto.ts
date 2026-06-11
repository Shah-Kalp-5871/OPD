import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { CasePriority, Severity } from '@prisma/client';

class VisitComplaintDto {
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

  @IsEnum(Severity)
  @IsOptional()
  severity?: Severity;

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

class AppointmentVitalsDto {
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @IsOptional()
  height?: number;

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @IsOptional()
  weight?: number;

  @IsNumber()
  @Type(() => Number)
  @Min(90)
  @Max(110)
  @IsOptional()
  temperature?: number;

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @IsOptional()
  pulse?: number;

  @IsString()
  @IsOptional()
  bloodPressure?: string;

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(100)
  @IsOptional()
  spo2?: number;

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @IsOptional()
  bmi?: number;
}

export class CheckInAppointmentDto {
  @IsUUID()
  appointmentId: string;

  @IsString()
  @IsOptional()
  visitType?: string;

  @IsEnum(CasePriority)
  @IsOptional()
  priority?: CasePriority;

  @IsString()
  @IsOptional()
  complaint?: string;

  @IsObject()
  @Type(() => AppointmentVitalsDto)
  @IsOptional()
  vitals?: AppointmentVitalsDto;

  @IsObject()
  @Type(() => VisitComplaintDto)
  @IsOptional()
  visitComplaint?: VisitComplaintDto;
}
