import { IsString, IsOptional, IsBoolean, IsInt, Min, IsUUID } from 'class-validator';

export class CreateLabCategoryDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  code?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @IsOptional()
  @Min(0)
  displayOrder?: number;
}

export class UpdateLabCategoryDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  code?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsInt()
  @IsOptional()
  @Min(0)
  displayOrder?: number;
}
