import { Transform } from "class-transformer";
import { IsEmail, IsOptional } from "class-validator";

export class CreateTeacherAccountDto {
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === "string" && value.trim() === "" ? undefined : value,
  )
  @IsEmail()
  email!: string;
}
