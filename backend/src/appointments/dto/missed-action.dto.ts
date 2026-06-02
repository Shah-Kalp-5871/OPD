import { IsString, IsOptional, IsNotEmpty, IsIn } from 'class-validator';

export class MissedActionDto {
  @IsString()
  @IsNotEmpty()
  patientId: string;

  @IsString()
  @IsOptional()
  appointmentId?: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['reschedule', 'no-answer', 'not-called'])
  action: 'reschedule' | 'no-answer' | 'not-called';

  @IsString()
  @IsOptional()
  newFuDate?: string;

  @IsString()
  @IsOptional()
  note?: string;
}
