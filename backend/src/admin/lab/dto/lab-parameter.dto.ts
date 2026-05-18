import {
  IsString,
  IsOptional,
  IsBoolean,
  IsInt,
  Min,
  IsUUID,
  IsNumber,
  IsEnum,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Gender } from '@prisma/client';

export class ReferenceRangeDto {
  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

  @IsInt()
  @IsOptional()
  minAge?: number;

  @IsInt()
  @IsOptional()
  maxAge?: number;

  @IsNumber()
  @IsOptional()
  minValue?: number;

  @IsNumber()
  @IsOptional()
  maxValue?: number;

  @IsString()
  @IsOptional()
  interpretation?: string;

  @IsString()
  @IsOptional()
  condition?: string;
}

export class CreateLabParameterDto {
  @IsUUID()
  categoryId: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  code?: string;

  @IsString()
  @IsOptional()
  unit?: string;

  @IsNumber()
  @IsOptional()
  basePrice?: number;

  @IsNumber()
  @IsOptional()
  criticalLow?: number;

  @IsNumber()
  @IsOptional()
  criticalHigh?: number;

  @IsString()
  @IsOptional()
  machineReadable?: string;

  @IsInt()
  @IsOptional()
  @Min(0)
  displayOrder?: number;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ReferenceRangeDto)
  referenceRanges?: ReferenceRangeDto[];
}

export class UpdateLabParameterDto {
  @IsUUID()
  @IsOptional()
  categoryId?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  code?: string;

  @IsString()
  @IsOptional()
  unit?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsNumber()
  @IsOptional()
  basePrice?: number;

  @IsNumber()
  @IsOptional()
  criticalLow?: number;

  @IsNumber()
  @IsOptional()
  criticalHigh?: number;

  @IsString()
  @IsOptional()
  machineReadable?: string;

  @IsInt()
  @IsOptional()
  @Min(0)
  displayOrder?: number;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ReferenceRangeDto)
  referenceRanges?: ReferenceRangeDto[];
}
