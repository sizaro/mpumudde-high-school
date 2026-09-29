import { ArrayMaxSize, IsArray, IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

export class SendSchoolCommunicationDto {
  @IsString()
  @IsIn(['EVERYONE', 'PARENTS', 'TEACHERS'])
  audience!: 'EVERYONE' | 'PARENTS' | 'TEACHERS';

  @IsString()
  @MaxLength(180)
  subject!: string;

  @IsString()
  @MaxLength(10_000)
  message!: string;

  @IsOptional()
  @IsString()
  classId?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(500)
  @IsString({ each: true })
  studentIds?: string[];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(500)
  @IsString({ each: true })
  teacherIds?: string[];
}
