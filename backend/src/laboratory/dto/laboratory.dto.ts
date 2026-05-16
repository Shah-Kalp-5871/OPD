import {
  IsString,
  IsEnum,
  IsOptional,
  IsArray,
  IsNumber,
  IsBoolean,
} from 'class-validator';

export enum InvestigationStatus {
  ORDERED = 'ORDERED',
  SAMPLE_COLLECTED = 'SAMPLE_COLLECTED',
  PROCESSING = 'PROCESSING',
  RESULT_READY = 'RESULT_READY',
  REVIEWED = 'REVIEWED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export class UpdateInvestigationStatusDto {
  @IsEnum(InvestigationStatus)
  status: InvestigationStatus;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class LabResultItemDto {
  @IsString()
  parameterId: string;

  @IsNumber()
  @IsOptional()
  numericValue?: number;

  @IsString()
  @IsOptional()
  textValue?: string;

  @IsBoolean()
  @IsOptional()
  isAbnormal?: boolean;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class SubmitLabResultsDto {
  @IsArray()
  results: LabResultItemDto[];

  @IsString()
  @IsOptional()
  notes?: string;
}
