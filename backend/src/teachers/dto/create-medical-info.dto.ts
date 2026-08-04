import { IsOptional, IsString } from 'class-validator';

export class CreateMedicalInfoDto {
  @IsOptional()
  @IsString()
  bloodGroup?: string;

  @IsOptional()
  @IsString()
  allergies?: string;

  @IsOptional()
  @IsString()
  medicalConditions?: string;

  @IsOptional()
  @IsString()
  medication?: string;

  @IsOptional()
  @IsString()
  disability?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
