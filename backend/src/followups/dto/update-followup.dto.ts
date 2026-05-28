import { IsString, IsOptional, IsEnum } from 'class-validator';
import { FollowupStatus } from '@prisma/client';

export class UpdateFollowupDto {
  @IsEnum(FollowupStatus)
  @IsOptional()
  status?: FollowupStatus;

  @IsString()
  @IsOptional()
  callOutcome?: string;
  
  @IsString()
  @IsOptional()
  newAppointmentId?: string;
}
