import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateDocumentDto {
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
  description?: string;

  @IsOptional()
  @IsString()
  storedFileName?: string;

  @IsOptional()
  @IsString()
  fileExtension?: string;

  @IsOptional()
  @IsString()
  mimeType?: string;

  @IsOptional()
  @IsInt()
  fileSize?: number;
}
