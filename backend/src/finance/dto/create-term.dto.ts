import { IsString, IsDateString, IsOptional, IsIn } from 'class-validator';

export class CreateTermDto {
  @IsString()
  name!: string;

  @IsDateString()
  startDate!: string;

  @IsDateString()
  endDate!: string;

  @IsOptional()
  @IsIn(['UPCOMING', 'ACTIVE', 'COMPLETED'])
  status?: string;

  @IsOptional()
  @IsString()
  academicYearId?: string;
}
