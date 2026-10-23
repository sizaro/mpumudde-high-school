import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsEmail, IsIn, IsInt, IsISO8601, IsObject, IsOptional, IsString, IsUrl, MaxLength, Min, ValidateNested } from "class-validator";
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
  @IsOptional() @IsBoolean() rsvpEnabled?: boolean;
  @IsOptional() @IsIn(["ALUMNI_ONLY", "PUBLIC_EMAIL"]) rsvpMode?: "ALUMNI_ONLY" | "PUBLIC_EMAIL";
  @IsOptional() @IsISO8601() rsvpDeadline?: string;
  @IsOptional() @IsInt() @Min(1) rsvpCapacity?: number;
  @IsOptional() @IsBoolean() waitlistEnabled?: boolean;
  @IsOptional() @IsUrl({ protocols: ["https"], require_protocol: true }) whatsappGroupUrl?: string;
  @IsOptional() @IsEmail() @MaxLength(254) organiserEmail?: string;
  @IsOptional() @IsUrl({ protocols: ["https"], require_protocol: true }) featuredImageUrl?: string;
  @IsOptional() @IsString() @MaxLength(500) featuredImagePublicId?: string;
  @IsOptional() @IsString() @MaxLength(180) featuredImageAlt?: string;
  @IsArray() @ValidateNested({ each: true }) @Type(() => EventAudienceDto) audiences!: EventAudienceDto[];
  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => ContentImageDto) images?: ContentImageDto[];
}
