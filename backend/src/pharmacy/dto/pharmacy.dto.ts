import {
  IsString,
  IsArray,
  IsOptional,
  IsInt,
  Min,
  IsEnum,
} from 'class-validator';

export class DispenseItemDto {
  @IsString()
  prescriptionItemId: string;

  @IsString()
  drugId: string;

  @IsInt()
  @Min(1)
  quantityDispensed: number;

  @IsString()
  @IsOptional()
  batchNumber?: string;
}

export class DispenseMedicationDto {
  @IsString()
  caseId: string;

  @IsString()
  prescriptionId: string;

  @IsArray()
  items: DispenseItemDto[];

  @IsString()
  @IsOptional()
  notes?: string;
}

export class ReceiveStockDto {
  @IsString()
  drugId: string;

  @IsString()
  batchNumber: string;

  @IsString()
  expiryDate: string;

  @IsString()
  @IsOptional()
  manufacturingDate?: string;

  @IsInt()
  @Min(0)
  quantity: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  mrp?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  purchasePrice?: number;

  @IsString()
  @IsOptional()
  supplierId?: string;

  @IsString()
  @IsOptional()
  location?: string;
}

export class AdjustStockDto {
  @IsString()
  batchId: string;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsEnum(['INCREMENT', 'DECREMENT'])
  type: 'INCREMENT' | 'DECREMENT';

  @IsString()
  @IsOptional()
  reason?: string;
}
