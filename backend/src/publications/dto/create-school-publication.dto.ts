import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsIn, IsObject, IsOptional, IsString, IsUrl, MaxLength, ValidateNested } from "class-validator";
import { PUBLICATION_KINDS, PUBLICATION_STATUSES } from "../../content/content.constants.js";
import { ContentImageDto } from "../../content/dto/content-image.dto.js";

export class CreateSchoolPublicationDto {
  @IsOptional() @IsIn(PUBLICATION_KINDS) kind?: (typeof PUBLICATION_KINDS)[number];
  @IsString() @MaxLength(220) title!: string;
  @IsOptional() @IsString() @MaxLength(240) slug?: string;
  @IsString() @MaxLength(1_200) summary!: string;
  @IsOptional() @IsString() @MaxLength(80) category?: string;
  @IsOptional() @IsObject() contentDocument?: Record<string, unknown>;
  @IsOptional() @IsString() alumniId?: string;
  @IsOptional() @IsBoolean() isFeatured?: boolean;
  @IsOptional() @IsUrl({ protocols: ["https"], require_protocol: true }) featuredImageUrl?: string;
  @IsOptional() @IsString() @MaxLength(500) featuredImagePublicId?: string;
  @IsOptional() @IsString() @MaxLength(180) featuredImageAlt?: string;
  @IsOptional() @IsBoolean() consentConfirmed?: boolean;
  @IsOptional() @IsString() @MaxLength(1_000) consentNote?: string;
  @IsOptional() @IsIn(PUBLICATION_STATUSES) status?: (typeof PUBLICATION_STATUSES)[number];
  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => ContentImageDto) images?: ContentImageDto[];
}
