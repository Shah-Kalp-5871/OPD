import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentMode } from '@prisma/client';

export class PaymentSplitDto {
  @IsNumber()
  @Type(() => Number)
  @Min(0.01)
  @IsNotEmpty()
  amount: number;

  @IsEnum(PaymentMode)
  @IsNotEmpty()
  paymentMode: PaymentMode;

  @IsString()
  @IsOptional()
  transactionId?: string;
}

export class PayBillDto {
  @IsNumber()
  @Type(() => Number)
  @Min(0.01)
  @IsOptional()
  amountPaid?: number;

  @IsEnum(PaymentMode)
  @IsOptional()
  paymentMode?: PaymentMode;

  @IsString()
  @IsOptional()
  transactionId?: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => PaymentSplitDto)
  splits?: PaymentSplitDto[];

  @IsBoolean()
  @IsOptional()
  isFoc?: boolean;

  @IsString()
  @IsOptional()
  focReason?: string;

  @IsString()
  @IsOptional()
  focPin?: string;
}
