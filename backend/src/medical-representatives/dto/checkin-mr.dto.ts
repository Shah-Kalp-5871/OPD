import { IsString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CheckInMrDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  mobile: string;

  @IsString()
  @IsOptional()
  companyName?: string;

  @IsUUID()
  @IsNotEmpty()
  doctorId: string;

  @IsString()
  @IsNotEmpty()
  appointmentTime: string;

}
