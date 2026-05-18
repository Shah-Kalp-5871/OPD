import { IsString, IsNumber, IsOptional, IsEnum } from 'class-validator';

export enum PaymentProviderType {
  STRIPE = 'STRIPE',
  RAZORPAY = 'RAZORPAY',
}

export class CreatePaymentIntentDto {
  @IsNumber()
  amount: number;

  @IsString()
  currency: string;

  @IsEnum(PaymentProviderType)
  provider: PaymentProviderType;

  @IsString()
  @IsOptional()
  billId?: string;

  @IsString()
  @IsOptional()
  appointmentId?: string;
}
