import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class RefundBillDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsNotEmpty()
  @IsString()
  reason: string;
}
