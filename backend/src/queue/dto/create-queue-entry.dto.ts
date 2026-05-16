import {
  IsString,
  IsEnum,
  IsOptional,
  IsNotEmpty,
  IsUUID,
} from 'class-validator';
import { CasePriority, QueueType } from '@prisma/client';

export class CreateQueueEntryDto {
  @IsUUID()
  caseId: string;

  @IsUUID()
  patientId: string;

  @IsUUID()
  @IsOptional()
  doctorId?: string;

  @IsEnum(QueueType)
  @IsOptional()
  queueType?: QueueType;

  @IsEnum(CasePriority)
  @IsOptional()
  priority?: CasePriority;
}
