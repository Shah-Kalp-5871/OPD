import { IsOptional, IsString, IsEnum, Matches } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';

export enum HistoryPaymentStatus {
  ALL = 'ALL',
  PAID = 'PAID',
  UNPAID = 'UNPAID',
}

export class BillingHistoryQueryDto extends PaginationDto {
  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'Date must be in YYYY-MM-DD format' })
  date?: string;

  @IsOptional()
  @IsEnum(HistoryPaymentStatus)
  status?: HistoryPaymentStatus;
}
