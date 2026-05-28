import { IsString, IsNotEmpty, IsDateString, IsOptional, IsEnum } from 'class-validator';
import { CasePriority } from '@prisma/client';

export class CreateFollowupDto {
  @IsString()
  @IsNotEmpty()
  caseId: string;

  @IsString()
  @IsNotEmpty()
  patientId: string;

  @IsDateString()
  @IsNotEmpty()
  dueDate: string;

  @IsString()
  @IsOptional()
  reason?: string;

  @IsEnum(CasePriority)
  @IsOptional()
  priority?: CasePriority;
}
