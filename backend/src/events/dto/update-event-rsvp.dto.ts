import { IsIn, IsInt, IsOptional, IsString, Max, MaxLength, Min } from "class-validator";

export class UpdateEventRsvpDto {
  @IsIn(["GOING", "MAYBE", "DECLINED"]) attendance!: "GOING" | "MAYBE" | "DECLINED";
  @IsOptional() @IsInt() @Min(0) @Max(20) guestCount?: number;
  @IsOptional() @IsString() @MaxLength(1000) note?: string;
}
