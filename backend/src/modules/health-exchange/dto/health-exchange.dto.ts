import { IsString, IsObject, IsOptional, IsEnum, IsBoolean } from 'class-validator';

export class RegisterConnectorDto {
  @IsString()
  name: string;

  @IsString()
  type: string; // e.g., 'HIE', 'LAB', 'INSURANCE'

  @IsString()
  endpoint: string;

  @IsObject()
  authConfig: Record<string, any>;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class CreateExchangeLogDto {
  @IsString()
  connectorId: string;

  @IsEnum(['INBOUND', 'OUTBOUND'])
  direction: string;

  @IsEnum(['SUCCESS', 'FAILED', 'RETRYING'])
  status: string;

  @IsString()
  @IsOptional()
  payload?: string;

  @IsString()
  @IsOptional()
  error?: string;
}
