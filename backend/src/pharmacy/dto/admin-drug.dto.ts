import { IsString, IsOptional, IsNumber, IsBoolean, IsDecimal, Min } from 'class-validator';

export class CreateNormalDrugDto {
  @IsString()
  drugName: string;

  @IsOptional()
  @IsString()
  genericName?: string;

  @IsString()
  formulation: string;

  @IsString()
  drugCategory: string;

  @IsString()
  unitOfMeasure: string;

  @IsNumber()
  @Min(0)
  unitPrice: number;

  @IsOptional()
  @IsBoolean()
  stockTracked?: boolean;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateNormalDrugDto extends CreateNormalDrugDto {}

export class CreateSimpleDrugDto {
  @IsString()
  drugName: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsNumber()
  @Min(0)
  unitPrice: number;

  @IsOptional()
  @IsNumber()
  stockQuantity?: number;

  @IsOptional()
  @IsNumber()
  lowStockLimit?: number;

  @IsOptional()
  @IsBoolean()
  stockTracked?: boolean;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateSimpleDrugDto extends CreateSimpleDrugDto {}
