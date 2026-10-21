import { IsIn, IsOptional, IsString, MaxLength } from "class-validator";
import { EVENT_AUDIENCES } from "../../content/content.constants.js";
export class EventAudienceDto {
  @IsIn(EVENT_AUDIENCES) audience!: (typeof EVENT_AUDIENCES)[number];
  @IsOptional() @IsString() schoolClassId?: string;
  @IsOptional() @IsString() academicYearId?: string;
  @IsOptional() @IsString() @MaxLength(80) stream?: string;
}
