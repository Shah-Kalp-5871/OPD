import { IsString, IsOptional, IsNotEmpty, IsEnum } from 'class-validator';

export class CreateCaseDto {
  @IsString()
  @IsNotEmpty()
  doctorId: string;

  @IsString()
  @IsOptional()
  visitType?: string;

  @IsString()
  @IsOptional()
  priority?: string;

  @IsString()
  @IsOptional()
  complaint?: string;
}
