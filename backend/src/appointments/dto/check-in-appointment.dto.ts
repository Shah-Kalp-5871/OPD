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
import { CasePriority } from '@prisma/client';

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
}
