import { IsEmail, IsIn, IsInt, IsOptional, IsString, Max, MaxLength, Min } from "class-validator";

export class CreateEventRsvpDto {
  @IsString() @MaxLength(160) fullName!: string;
  @IsEmail() @MaxLength(254) email!: string;
  @IsOptional() @IsIn(["GOING", "MAYBE", "DECLINED"]) attendance?: "GOING" | "MAYBE" | "DECLINED";
  @IsOptional() @IsInt() @Min(0) @Max(20) guestCount?: number;
  @IsOptional() @IsString() @MaxLength(1000) note?: string;
}
