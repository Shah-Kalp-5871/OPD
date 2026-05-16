import {
  IsDateString,
  IsMilitaryTime,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateAppointmentDto {
  @IsNotEmpty()
  @IsUUID()
  patientId: string;

  @IsNotEmpty()
  @IsUUID()
  doctorId: string; // This should be the DoctorProfile ID based on schema

  @IsNotEmpty()
  @IsDateString()
  appointmentDate: string;

  @IsNotEmpty()
  @IsMilitaryTime()
  appointmentTime: string; // HH:mm format

  @IsNotEmpty()
  @IsString()
  purpose: string;

  @IsOptional()
  @IsString()
  remarks?: string;
}
