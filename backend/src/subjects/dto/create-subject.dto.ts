import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSubjectDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
