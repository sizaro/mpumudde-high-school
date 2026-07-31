import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateEmploymentDto {
  @IsString()
  @IsNotEmpty()
  employeeNumber!: string;

  @IsOptional()
  @IsString()
  position?: string;

  @IsOptional()
  @IsString()
  department?: string;

  @IsOptional()
  @IsString()
  employmentType?: string;
  // Full Time | Part Time | Contract | Volunteer

  @IsOptional()
  @IsDateString()
  employmentDate?: string;

  @IsOptional()
  @IsDateString()
  probationEndDate?: string;

  @IsOptional()
  @IsInt()
  salary?: number;

  @IsOptional()
  @IsString()
  payFrequency?: string;

  @IsOptional()
  @IsString()
  status?: string;
  // active | inactive | suspended
}
