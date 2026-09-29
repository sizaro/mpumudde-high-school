import { IsEmail, IsString, MaxLength } from "class-validator";

export class StartAlumniRegistrationDto {
  @IsEmail()
  @IsString()
  @MaxLength(254)
  email!: string;
}
