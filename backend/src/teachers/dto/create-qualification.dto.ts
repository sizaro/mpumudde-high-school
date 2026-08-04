import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateQualificationDto {
  @IsOptional()
  @IsString()
  qualificationType?: string;
  // Certificate | Diploma | Bachelor's Degree | Master's Degree | PhD
  // Professional Certification | Other

  @IsString()
  @IsNotEmpty()
  qualificationName!: string;

  @IsString()
  @IsNotEmpty()
  institution!: string;

  @IsOptional()
  @IsString()
  specialization?: string;

  @IsOptional()
  @IsString()
  grade?: string;

  @IsOptional()
  @IsInt()
  yearStarted?: number;

  @IsOptional()
  @IsInt()
  yearCompleted?: number;

  @IsOptional()
  @IsString()
  certificateNumber?: string;

  @IsOptional()
  @IsString()
  documentUrl?: string;
}
