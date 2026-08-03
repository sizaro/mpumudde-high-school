import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateFeeStructureDto {
  @IsString()
  @IsNotEmpty()
  academicYearId!: string;

  @IsString()
  @IsNotEmpty()
  termId!: string;

  @IsString()
  @IsNotEmpty()
  classId!: string;

  @IsString()
  @IsNotEmpty()
  studentCategoryId!: string;

  @IsString()
  @IsNotEmpty()
  feeTypeId!: string;

  @IsInt()
  @Min(0)
  expectedAmount!: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
