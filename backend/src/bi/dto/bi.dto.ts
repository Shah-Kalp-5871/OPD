import { IsOptional, IsString, IsDateString, IsNumber, Min, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export enum ExportFormat {
  PDF = 'PDF',
  CSV = 'CSV',
  XLSX = 'XLSX',
}

export enum ReportType {
  REVENUE = 'REVENUE',
  TAX_GST = 'TAX_GST',
  DOCTOR_PRODUCTIVITY = 'DOCTOR_PRODUCTIVITY',
  INSURANCE_CLAIMS = 'INSURANCE_CLAIMS',
  PHARMACY_VALUATION = 'PHARMACY_VALUATION',
  AUDIT_COMPLIANCE = 'AUDIT_COMPLIANCE',
}

export class BiFilterDto {
  @IsOptional()
  @IsString()
  branchId?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  doctorId?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 20;
}

export class ExportRequestDto {
  @IsEnum(ReportType)
  reportType: ReportType;

  @IsEnum(ExportFormat)
  format: ExportFormat;

  @IsOptional()
  @IsString()
  branchId?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}
