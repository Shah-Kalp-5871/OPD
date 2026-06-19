import { IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateConsentDto {
  @IsUUID()
  templateId: string;

  @IsString()
  @IsOptional()
  signatureUrl?: string;

  @IsString()
  @IsOptional()
  customRisks?: string;

  @IsString()
  @IsOptional()
  doctorNotes?: string;
}
