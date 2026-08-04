import { IsEmail, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateParentPortalAccountDto {
  @IsOptional()
  @Transform(({ value }) => typeof value === 'string' && value.trim() === '' ? undefined : value)
  @IsEmail()
  loginEmail?: string;
}
