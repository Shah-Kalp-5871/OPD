import { IsString, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';

export class BulkCancelDto {
  @IsDateString()
  date: string;

  @IsOptional()
  @IsString()
  doctorId?: string;

  @IsString()
  @IsNotEmpty()
  reason: string;
}
