import { IsEnum, IsOptional, IsString } from 'class-validator';
import { QueueStatus, CaseStage } from '@prisma/client';

export class UpdateQueueStatusDto {
  @IsEnum(QueueStatus)
  status: QueueStatus;

  @IsString()
  @IsOptional()
  action?: string;
}

export class UpdateCaseStageDto {
  @IsEnum(CaseStage)
  stage: CaseStage;
}
