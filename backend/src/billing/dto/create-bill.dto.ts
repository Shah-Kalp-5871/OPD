import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class BillItemDto {
  @IsString()
  @IsNotEmpty()
  serviceName: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @IsNotEmpty()
  unitPrice: number;

  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @IsOptional()
  quantity: number = 1;

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(100)
  @IsOptional()
  discount: number = 0;
}

export class CreateBillDto {
  @IsUUID()
  caseId: string;

  @IsUUID()
  @IsOptional()
  patientId?: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => BillItemDto)
  items?: BillItemDto[];

  @IsBoolean()
  @IsOptional()
  autoPopulateFromConsultation?: boolean;
}
