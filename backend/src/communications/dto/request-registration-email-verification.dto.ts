import { IsEmail, IsIn, IsString } from "class-validator";

export class RequestRegistrationEmailVerificationDto {
  @IsString()
  @IsIn(["PARENT", "TEACHER"])
  ownerType!: "PARENT" | "TEACHER";

  @IsEmail()
  email!: string;
}
