import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreatePatientDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsOptional()
  middleName?: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  mobile: string;

  @IsString()
  @IsNotEmpty()
  gender: string;

  @IsString()
  @IsOptional()
  dob?: string;

  @IsNumber()
  @IsOptional()
  age?: number;
}
