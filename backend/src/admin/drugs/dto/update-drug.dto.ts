import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  Min,
} from 'class-validator';

export class UpdateDrugDto {
  @IsString()
  @IsOptional()
  drugName?: string;

  @IsString()
  @IsOptional()
  genericName?: string;

  @IsString()
  @IsOptional()
  manufacturer?: string;

  @IsString()
  @IsOptional()
  drugCategory?: string;

  @IsString()
  @IsOptional()
  formulation?: string;

  @IsString()
  @IsOptional()
  strength?: string;

  @IsString()
  @IsOptional()
  unitOfMeasure?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  unitPrice?: number;

  @IsBoolean()
  @IsOptional()
  taxable?: boolean;

  @IsBoolean()
  @IsOptional()
  stockTracked?: boolean;

  @IsString()
  @IsOptional()
  schedule?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
