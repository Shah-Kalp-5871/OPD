import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, IsArray, MinLength, IsInt, IsBoolean } from 'class-validator';

export class CreateDoctorDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsNumber()
  consultationFee: number;

  @IsString()
  @IsOptional()
  specialization?: string;

  @IsString()
  @IsOptional()
  licenseNumber?: string;

  @IsArray()
  @IsString({ each: true })
  availableDays: string[];

  @IsString()
  @IsOptional()
  morningStart?: string;

  @IsString()
  @IsOptional()
  morningEnd?: string;

  @IsString()
  @IsOptional()
  eveningStart?: string;

  @IsString()
  @IsOptional()
  eveningEnd?: string;

  @IsInt()
  appointmentGap: number;

  @IsInt()
  slotDuration: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateDoctorDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  @MinLength(6)
  password?: string;

  @IsNumber()
  @IsOptional()
  consultationFee?: number;

  @IsString()
  @IsOptional()
  specialization?: string;

  @IsString()
  @IsOptional()
  licenseNumber?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  availableDays?: string[];

  @IsString()
  @IsOptional()
  morningStart?: string;

  @IsString()
  @IsOptional()
  morningEnd?: string;

  @IsString()
  @IsOptional()
  eveningStart?: string;

  @IsString()
  @IsOptional()
  eveningEnd?: string;

  @IsInt()
  @IsOptional()
  appointmentGap?: number;

  @IsInt()
  @IsOptional()
  slotDuration?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
