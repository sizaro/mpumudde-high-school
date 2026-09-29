import { IsString, Length } from 'class-validator';

export class VerifyCommunicationContactDto {
  @IsString()
  @Length(6, 6)
  code!: string;
}
