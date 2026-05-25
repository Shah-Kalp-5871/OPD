import { IsString, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';

export class AddPatientDocumentDto {
  @IsString()
  @IsNotEmpty()
  documentType: string;

  @IsString()
  @IsOptional()
  documentNumber?: string;

  @IsString()
  @IsOptional()
  labName?: string;

  @IsDateString()
  @IsOptional()
  reportDate?: string;

  @IsString()
  @IsNotEmpty()
  fileUrl: string;
}
