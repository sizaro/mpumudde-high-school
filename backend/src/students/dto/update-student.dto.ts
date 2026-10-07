import { PartialType } from '@nestjs/mapped-types';
import { CreateStudentDto } from './create-student.dto.js';
import { IsOptional, IsString } from 'class-validator';

export class UpdateStudentDto extends PartialType(CreateStudentDto) {
  declare admissionNumber?: string;
  declare firstName?: string;
  declare lastName?: string;
  declare dateOfBirth?: string;
  declare gender?: string;
  declare passportPhoto?: string;
  declare isActive?: boolean;
  declare academicYearId?: string;
  declare termId?: string;
  declare classId?: string;
  declare studentCategoryId?: string;

  @IsOptional() @IsString() nationality?: string;
  @IsOptional() @IsString() address?: string;
  @IsOptional() @IsString() previousSchool?: string;
  @IsOptional() @IsString() bloodGroup?: string;
  @IsOptional() @IsString() allergies?: string;
  @IsOptional() @IsString() medicalConditions?: string;
  @IsOptional() @IsString() specialNeeds?: string;
  @IsOptional() @IsString() medicalNotes?: string;
}
