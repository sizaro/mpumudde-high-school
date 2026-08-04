import { IsOptional, IsString } from 'class-validator';

export class UnlinkParentStudentDto {
  @IsOptional()
  @IsString()
  reason?: string;
}
