import { IsString, IsObject, IsOptional, IsEnum } from 'class-validator';

export class CreateCdsRuleDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsObject()
  condition: Record<string, any>;

  @IsObject()
  action: Record<string, any>;

  @IsEnum(['INFO', 'WARNING', 'CRITICAL'])
  @IsOptional()
  severity?: string;
}

export class EvaluateCdsDto {
  @IsString()
  patientId: string;

  @IsString()
  @IsOptional()
  encounterId?: string;

  @IsObject()
  context: Record<string, any>;
}
