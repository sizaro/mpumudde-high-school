import { IsBoolean, IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCommunicationContactDto {
  @IsString()
  @IsIn(['PARENT', 'TEACHER', 'STUDENT'])
  ownerType!: 'PARENT' | 'TEACHER' | 'STUDENT';

  @IsString()
  ownerId!: string;

  @IsOptional()
  @IsString()
  @IsIn(['EMAIL', 'PHONE', 'WHATSAPP'])
  kind?: 'EMAIL' | 'PHONE' | 'WHATSAPP';

  @IsString()
  @MaxLength(254)
  value!: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  label?: string;

  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;
}
