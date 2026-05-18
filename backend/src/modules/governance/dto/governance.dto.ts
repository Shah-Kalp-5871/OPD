import { IsString, IsOptional, IsEnum, IsInt } from 'class-validator';

export class LogPhiAccessDto {
  @IsString()
  userId: string;

  @IsString()
  patientId: string;

  @IsEnum(['READ', 'EXPORT'])
  action: string;

  @IsString()
  resource: string;

  @IsString()
  @IsOptional()
  reason?: string;

  @IsString()
  @IsOptional()
  ipAddress?: string;
}

export class CreateRetentionPolicyDto {
  @IsString()
  resourceType: string;

  @IsInt()
  retentionDays: number;

  @IsEnum(['ARCHIVE', 'PURGE'])
  action: string;
}
