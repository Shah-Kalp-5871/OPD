import { IsString, IsOptional, IsNumber, IsInt } from 'class-validator';

export class AddVitalsDto {
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
