import { IsString, IsOptional, IsDateString, IsInt, IsNumber } from 'class-validator';

export class UpdatePatientProfileDto {
  @IsDateString()
  @IsOptional()
  dob?: string;

  @IsInt()
  @IsOptional()
  age?: number;

  @IsString()
  @IsOptional()
  bloodGroup?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  state?: string;

  @IsString()
  @IsOptional()
  occupation?: string;

  @IsString()
  @IsOptional()
  maritalStatus?: string;

  @IsString()
  @IsOptional()
  allergies?: string;

  @IsString()
  @IsOptional()
  emergencyContact?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
