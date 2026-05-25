import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class AddPatientDocumentDto {
  @IsString()
  @IsNotEmpty()
  documentType: string;

  @IsString()
  @IsOptional()
  documentNumber?: string;

  @IsString()
  @IsNotEmpty()
  fileUrl: string;
}
