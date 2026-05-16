import { IsOptional, IsString, IsInt, Min, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';

export class PaginationQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  limit?: number = 20;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  includeInactive?: boolean = false;
}
