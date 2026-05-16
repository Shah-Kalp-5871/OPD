import { IsOptional, IsString, IsInt, Min, IsEnum, IsBoolean, IsDateString } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class PatientQueryDto {
  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  minAge?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  maxAge?: number;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  isActive?: boolean;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  doctorId?: string;
}
