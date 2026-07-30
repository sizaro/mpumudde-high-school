import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTeachingAssignmentDto {
  @IsString()
  @IsNotEmpty()
  teacherId!: string;

  @IsString()
  @IsNotEmpty()
  classId!: string;

  @IsString()
  @IsNotEmpty()
  subjectId!: string;
}
