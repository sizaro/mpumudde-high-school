import { IsISO8601, IsOptional, IsString, MaxLength } from "class-validator";
export class EventDecisionDto {
  @IsOptional() @IsString() @MaxLength(1_000) reason?: string;
  @IsOptional() @IsISO8601() startsAt?: string;
  @IsOptional() @IsISO8601() endsAt?: string;
}
