import { IsString, IsNotEmpty, IsNumber, IsOptional, IsEnum } from 'class-validator';

export class PayBillDto {
  @IsNumber()
  @IsNotEmpty()
  amountPaid: number;

  @IsString()
  @IsNotEmpty()
  paymentMode: string; // CASH, CARD, UPI, ONLINE

  @IsString()
  @IsOptional()
  transactionId?: string;
}
