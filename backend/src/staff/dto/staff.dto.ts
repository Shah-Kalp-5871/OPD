import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
  IsEnum,
  IsBoolean,
} from 'class-validator';
import { Role } from '@prisma/client';

export class CreateStaffDto {
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

  @IsEnum(Role)
  role: Role;

  @IsNumber()
  salary: number;

  @IsNumber()
  overtimeRate: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateStaffDto {
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

  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @IsNumber()
  @IsOptional()
  salary?: number;

  @IsNumber()
  @IsOptional()
  overtimeRate?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
