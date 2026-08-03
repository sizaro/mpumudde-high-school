import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Matches, Max, Min } from 'class-validator';

export class ListPaymentsDto {
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page = 1;
  @IsOptional() @Type(() => Number) @IsInt() @Min(5) @Max(100) pageSize = 20;
  @IsOptional() @IsString() search?: string;
  @IsOptional() @Matches(/^\d{4}-\d{2}-\d{2}$/) startDate?: string;
  @IsOptional() @Matches(/^\d{4}-\d{2}-\d{2}$/) endDate?: string;
  @IsOptional() @IsString() academicYearId?: string;
  @IsOptional() @IsString() termId?: string;
  @IsOptional() @IsString() classId?: string;
  @IsOptional() @IsString() studentCategoryId?: string;
  @IsOptional() @IsString() feeTypeId?: string;
  @IsOptional() @IsString() method?: string;
  @IsOptional() @IsString() status?: string;
  @IsOptional() @IsString() recordedByUserId?: string;
}

export class SearchPaymentStudentsDto {
  @IsOptional() @IsString() search?: string;
  @IsOptional() @IsString() classId?: string;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(50) limit = 15;
}
