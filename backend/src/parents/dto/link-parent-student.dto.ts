import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class LinkParentStudentDto {
  @IsString()
  @IsNotEmpty()
  studentId!: string;

  @IsOptional()
  @IsString()
  relationship?: string;

  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;
}
