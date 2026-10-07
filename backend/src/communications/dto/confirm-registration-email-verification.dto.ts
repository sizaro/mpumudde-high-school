import { IsString, Length } from "class-validator";

export class ConfirmRegistrationEmailVerificationDto {
  @IsString()
  @Length(6, 6)
  code!: string;
}
