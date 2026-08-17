import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTeachingAssignmentDto {
  @IsString()
  @IsNotEmpty()
  teacherId!: string;

  @IsString()
  @IsNotEmpty()
  subjectId!: string;

  @IsOptional()
  @IsString()
  academicYearId?: string;

  @IsOptional()
  @IsString()
  academicYearClassId?: string;

  @IsOptional()
  @IsString()
  classSubjectId?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}
