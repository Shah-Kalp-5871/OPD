import { IsUUID, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { AddVitalsDto } from './add-vitals.dto';
import { AddComplaintDto } from './add-complaint.dto';

export class AddClinicalDataDto {
  @IsUUID()
  caseId: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => AddVitalsDto)
  vitals?: AddVitalsDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => AddComplaintDto)
  complaint?: AddComplaintDto;
}
