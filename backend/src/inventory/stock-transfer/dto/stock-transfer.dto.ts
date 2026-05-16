import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { StockTransferStatus } from '@prisma/client';

export class StockTransferItemDto {
  @IsString()
  @IsNotEmpty()
  drugId: string;

  @IsOptional()
  @IsString()
  batchId?: string;

  @IsNumber()
  @Min(1)
  requestedQty: number;
}

export class CreateStockTransferDto {
  @IsString()
  @IsNotEmpty()
  destBranchId: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StockTransferItemDto)
  items: StockTransferItemDto[];
}

export class UpdateStockTransferStatusDto {
  @IsEnum(StockTransferStatus)
  status: StockTransferStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}
