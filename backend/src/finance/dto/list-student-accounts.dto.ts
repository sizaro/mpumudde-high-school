import { IsIn, IsOptional, IsString } from 'class-validator';

export class ListStudentAccountsDto {
  @IsOptional() @IsString() academicYearId?: string;
  @IsOptional() @IsString() termId?: string;
  @IsOptional() @IsString() classId?: string;
  @IsOptional() @IsString() studentCategoryId?: string;
  @IsOptional() @IsString() search?: string;
  @IsOptional() @IsIn(['FULLY_PAID', 'PARTIALLY_PAID', 'NOT_PAID', 'OVERPAID', 'WAIVED']) status?: string;
}
