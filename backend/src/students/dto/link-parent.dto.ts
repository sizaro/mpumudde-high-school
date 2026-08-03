import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class LinkParentDto {
  @IsString()
  @IsNotEmpty()
  parentId!: string;

  @IsOptional()
  @IsString()
  relationship?: string;

  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;
}
