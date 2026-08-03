import { IsBooleanString, IsOptional, IsString } from 'class-validator';

export class ListFeeStructuresDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  academicYearId?: string;

  @IsOptional()
  @IsString()
  termId?: string;

  @IsOptional()
  @IsString()
  classId?: string;

  @IsOptional()
  @IsString()
  studentCategoryId?: string;

  @IsOptional()
  @IsString()
  feeTypeId?: string;

  @IsOptional()
  @IsBooleanString()
  isActive?: string;
}
