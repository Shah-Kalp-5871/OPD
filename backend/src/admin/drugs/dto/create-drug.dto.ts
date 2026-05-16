import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsNotEmpty,
  Min,
} from 'class-validator';

export class CreateDrugDto {
  @IsString()
  @IsNotEmpty()
  drugName: string;

  @IsString()
  @IsOptional()
  genericName?: string;

  @IsString()
  @IsOptional()
  manufacturer?: string;

  @IsString()
  @IsNotEmpty()
  drugCategory: string;

  @IsString()
  @IsNotEmpty()
  formulation: string;

  @IsString()
  @IsOptional()
  strength?: string;

  @IsString()
  @IsNotEmpty()
  unitOfMeasure: string;

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
