import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class AttendanceRecordDto {
  @IsString()
  @IsNotEmpty()
  studentId!: string;

  @IsString()
  @IsNotEmpty()
  status!: string;
  // Present | Absent | Late | Excused
}

export class CreateAttendanceSessionDto {
  @IsOptional()
  @IsString()
  academicYearId?: string;

  @IsOptional()
  @IsString()
  termId?: string;

  @IsString()
  @IsNotEmpty()
  classId!: string;

  @IsString()
  @IsNotEmpty()
  subjectId!: string;

  @IsOptional()
  @IsString()
  classSubjectId?: string;

  @IsOptional()
  @IsString()
  overrideReason?: string;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttendanceRecordDto)
  records!: AttendanceRecordDto[];
}
