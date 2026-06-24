import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsArray,
  MinLength,
  IsInt,
  IsBoolean,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ShiftDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @IsOptional()
  doctorId?: string;

  @IsInt()
  dayOfWeek: number;

  @IsString()
  @IsNotEmpty()
  startTime: string;

  @IsString()
  @IsNotEmpty()
  endTime: string;

  @IsInt()
  slotDuration: number;

  @IsInt()
  @IsOptional()
  appointmentGap?: number;
}

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
  @ValidateNested({ each: true })
  @Type(() => ShiftDto)
  @IsOptional()
  shifts?: ShiftDto[];

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
  @ValidateNested({ each: true })
  @Type(() => ShiftDto)
  @IsOptional()
  shifts?: ShiftDto[];

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class CreateDoctorLeaveDto {
  @IsString()
  @IsNotEmpty()
  startDate: string;

  @IsString()
  @IsNotEmpty()
  endDate: string;

  @IsString()
  @IsOptional()
  reason?: string;
}
