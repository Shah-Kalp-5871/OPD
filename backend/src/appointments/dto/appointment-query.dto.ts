import { IsOptional, IsString, IsEnum, IsDateString } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { AppointmentStatus } from '@prisma/client';

export class AppointmentQueryDto {
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  q?: number | string;

  @IsOptional()
  @IsString()
  doctorId?: string;

  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  date?: string; // Standard single date filter
}
