import { IsString, IsUrl, IsNotEmpty, IsEnum, IsOptional, IsArray } from 'class-validator';

export class WebhookRegisterDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsUrl()
  @IsNotEmpty()
  url: string;

  @IsEnum(['THYROCARE', 'REDCLIFFE', 'METROPOLIS', 'GENERIC'])
  providerType: 'THYROCARE' | 'REDCLIFFE' | 'METROPOLIS' | 'GENERIC';

  @IsString()
  @IsNotEmpty()
  secret: string;

  @IsArray()
  @IsOptional()
  allowedIps?: string[];
}

export class InboundResultDto {
  @IsString()
  @IsNotEmpty()
  orderId: string;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsUrl()
  @IsOptional()
  reportUrl?: string;

  @IsArray()
  @IsOptional()
  results?: Array<{
    parameterId: string;
    numericValue?: number;
    textValue?: string;
    isAbnormal?: boolean;
    notes?: string;
  }>;
}
