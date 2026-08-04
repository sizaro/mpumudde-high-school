import { ArrayMinSize, IsArray, IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Transform } from 'class-transformer';
import { Type } from 'class-transformer';
import { LinkParentStudentDto } from './link-parent-student.dto.js';
import { GuardianDocumentDto } from './guardian-document.dto.js';

export class CreateParentDto {
  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @Transform(({ value }) => typeof value === 'string' && value.trim() === '' ? undefined : value)
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  occupation?: string;

  @IsOptional()
  @IsString()
  profilePhoto?: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @Transform(({ value }) => typeof value === 'string' && value.trim() === '' ? undefined : value)
  @IsEmail()
  loginEmail?: string;

  @IsOptional()
  @IsString()
  relationship?: string;

  @IsOptional()
  @IsString()
  identityDocumentType?: string;

  @IsOptional()
  @IsString()
  identityDocumentUrl?: string;

  @IsOptional()
  @IsString()
  studentId?: string;

  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;

  @IsOptional()
  @IsBoolean()
  createLoginAccount?: boolean;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => LinkParentStudentDto)
  students?: LinkParentStudentDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GuardianDocumentDto)
  documents?: GuardianDocumentDto[];
}

