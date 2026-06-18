import { IsDateString, IsNotEmpty, IsString, Matches, IsOptional } from 'class-validator';

export class RescheduleAppointmentDto {
  @IsNotEmpty()
  @IsDateString()
  newDate: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'newTime must be in HH:mm format',
  })
  newTime: string;
  @IsString()
  @IsNotEmpty()
  remarks: string;

  @IsString()
  @IsOptional()
  newDoctorId?: string;
}
