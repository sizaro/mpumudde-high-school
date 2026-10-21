import { Type } from "class-transformer";
import { IsArray, IsIn, IsISO8601, IsObject, IsOptional, IsString, IsUrl, MaxLength, ValidateNested } from "class-validator";
import { EVENT_PUBLICATION_STATUSES, EVENT_RECURRENCE_RULES, EVENT_VISIBILITIES } from "../../content/content.constants.js";
import { ContentImageDto } from "../../content/dto/content-image.dto.js";
import { EventAudienceDto } from "./event-audience.dto.js";

export class CreateSchoolEventDto {
  @IsString() @MaxLength(220) title!: string;
  @IsOptional() @IsString() @MaxLength(240) slug?: string;
  @IsString() @MaxLength(100) type!: string;
  @IsOptional() @IsString() @MaxLength(220) venue?: string;
  @IsOptional() @IsObject() descriptionDocument?: Record<string, unknown>;
  @IsISO8601() startsAt!: string;
  @IsOptional() @IsISO8601() endsAt?: string;
  @IsOptional() @IsIn(EVENT_RECURRENCE_RULES) recurrenceRule?: (typeof EVENT_RECURRENCE_RULES)[number];
  @IsOptional() @IsString() @MaxLength(220) seriesTitle?: string;
  @IsOptional() @IsIn(EVENT_VISIBILITIES) visibility?: (typeof EVENT_VISIBILITIES)[number];
  @IsOptional() @IsIn(EVENT_PUBLICATION_STATUSES) publicationStatus?: (typeof EVENT_PUBLICATION_STATUSES)[number];
  @IsOptional() @IsUrl({ protocols: ["https"], require_protocol: true }) featuredImageUrl?: string;
  @IsOptional() @IsString() @MaxLength(500) featuredImagePublicId?: string;
  @IsOptional() @IsString() @MaxLength(180) featuredImageAlt?: string;
  @IsArray() @ValidateNested({ each: true }) @Type(() => EventAudienceDto) audiences!: EventAudienceDto[];
  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => ContentImageDto) images?: ContentImageDto[];
}
