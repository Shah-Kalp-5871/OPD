import { IsString, IsArray, IsEmail, IsOptional, IsUrl } from 'class-validator';

export class RegisterSmartAppDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsUrl({}, { each: true })
  redirectUris: string[];

  @IsArray()
  @IsString({ each: true })
  scopes: string[];

  @IsEmail()
  developerEmail: string;
}

export class SmartLaunchDto {
  @IsString()
  appId: string;

  @IsString()
  @IsOptional()
  patientId?: string;

  @IsString()
  @IsOptional()
  encounterId?: string;
}
