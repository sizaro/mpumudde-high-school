import { PartialType } from '@nestjs/mapped-types';
import { CreateStudentDto } from './create-student.dto.js';
import { IsOptional, IsString } from 'class-validator';

export class UpdateStudentDto extends PartialType(CreateStudentDto) {
  @IsOptional() @IsString() nationality?: string;
  @IsOptional() @IsString() address?: string;
  @IsOptional() @IsString() previousSchool?: string;
  @IsOptional() @IsString() bloodGroup?: string;
  @IsOptional() @IsString() allergies?: string;
  @IsOptional() @IsString() medicalConditions?: string;
  @IsOptional() @IsString() specialNeeds?: string;
  @IsOptional() @IsString() medicalNotes?: string;
}
