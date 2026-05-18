import { IsOptional, IsString, IsEnum, IsDateString } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { AppointmentStatus } from '@prisma/client';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class AppointmentQueryDto extends PaginationDto {
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
