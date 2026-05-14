import { IsString, IsEnum, IsOptional, IsNotEmpty } from 'class-validator';
import { QueueType, QueueStatus } from '@prisma/client';

export class CreateQueueEntryDto {
  @IsString()
  @IsNotEmpty()
  caseId: string;

  @IsString()
  @IsNotEmpty()
  patientId: string;

  @IsString()
  @IsOptional()
  doctorId?: string;

  @IsEnum(QueueType)
  @IsOptional()
  queueType?: QueueType;

  @IsString()
  @IsOptional()
  priority?: string;
}
