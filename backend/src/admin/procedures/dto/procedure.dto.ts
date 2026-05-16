import { IsString, IsOptional, IsBoolean, IsInt, IsNumber, Min, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class ConsumableDto {
  @IsString()
  itemName: string;

  @IsInt()
  @IsOptional()
  @Min(1)
  defaultQuantity?: number;

  @IsBoolean()
  @IsOptional()
  isOptional?: boolean;

  @IsString()
  @IsOptional()
  unit?: string;
}

export class CreateProcedureDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  code?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  basePrice?: number;

  @IsInt()
  @IsOptional()
  @Min(1)
  estimatedDuration?: number;

  @IsString()
  @IsOptional()
  category?: string;

  @IsInt()
  @IsOptional()
  @Min(0)
  displayOrder?: number;

  @IsBoolean()
  @IsOptional()
  requiresConsent?: boolean;

  @IsBoolean()
  @IsOptional()
  requiresNursing?: boolean;

  @IsBoolean()
  @IsOptional()
  requiresRoom?: boolean;

  @IsString()
  @IsOptional()
  preInstructions?: string;

  @IsString()
  @IsOptional()
  postInstructions?: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ConsumableDto)
  consumables?: ConsumableDto[];
}

export class UpdateProcedureDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  code?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  basePrice?: number;

  @IsInt()
  @IsOptional()
  @Min(1)
  estimatedDuration?: number;

  @IsString()
  @IsOptional()
  category?: string;

  @IsInt()
  @IsOptional()
  @Min(0)
  displayOrder?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  requiresConsent?: boolean;

  @IsBoolean()
  @IsOptional()
  requiresNursing?: boolean;

  @IsBoolean()
  @IsOptional()
  requiresRoom?: boolean;

  @IsString()
  @IsOptional()
  preInstructions?: string;

  @IsString()
  @IsOptional()
  postInstructions?: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ConsumableDto)
  consumables?: ConsumableDto[];
}
