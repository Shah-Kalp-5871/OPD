import { IsString, IsOptional, IsNumber, IsInt, IsUUID } from 'class-validator';

export class AddVitalsDto {
  @IsUUID()
  @IsOptional()
  caseId?: string;

  @IsNumber()
  @IsOptional()
  height?: number;

  @IsNumber()
  @IsOptional()
  weight?: number;

  @IsNumber()
  @IsOptional()
  bmi?: number;

  @IsString()
  @IsOptional()
  bloodPressure?: string;

  @IsInt()
  @IsOptional()
  pulse?: number;

  @IsNumber()
  @IsOptional()
  temperature?: number;

  @IsInt()
  @IsOptional()
  spo2?: number;
}
