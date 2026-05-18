import { IsBoolean, IsOptional } from 'class-validator';

export class UpdatePreferenceDto {
  @IsBoolean()
  @IsOptional()
  reminders?: boolean;

  @IsBoolean()
  @IsOptional()
  marketing?: boolean;

  @IsBoolean()
  @IsOptional()
  prescription?: boolean;

  @IsBoolean()
  @IsOptional()
  followup?: boolean;

  @IsBoolean()
  @IsOptional()
  queueAlerts?: boolean;
}
