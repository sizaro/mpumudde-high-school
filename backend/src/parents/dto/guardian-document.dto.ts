import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GuardianDocumentDto {
  @IsString()
  @IsNotEmpty()
  documentCategoryId!: string;

  @IsString()
  @IsNotEmpty()
  originalFileName!: string;

  @IsString()
  @IsNotEmpty()
  fileUrl!: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  mimeType?: string;

  @IsOptional()
  @IsString()
  fileExtension?: string;

  @IsOptional()
  @IsInt()
  fileSize?: number;
}
