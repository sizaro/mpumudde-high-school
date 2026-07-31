import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateParentDto {
  @IsString() firstName: string;
  @IsString() lastName: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() occupation?: string;
  @IsOptional() @IsString() address?: string;
  @IsOptional() @IsString() profilePhoto?: string;
  @IsOptional() @IsString() identityDocumentType?: string;
  @IsOptional() @IsString() identityDocumentUrl?: string;
  @IsOptional() @IsString() relationship?: string;
  @IsOptional() @IsString() studentId?: string;
  @IsOptional() @IsBoolean() primary?: boolean;
}
