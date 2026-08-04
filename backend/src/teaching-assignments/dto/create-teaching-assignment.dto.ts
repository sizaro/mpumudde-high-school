import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTeachingAssignmentDto {
  @IsString()
  @IsNotEmpty()
  teacherId!: string;

  @IsString()
  @IsNotEmpty()
  subjectId!: string;
}
