import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString, IsUrl, Max, MaxLength, Min } from "class-validator";

export class ContentImageDto {
  @IsUrl({ protocols: ["https"], require_protocol: true }) secureUrl!: string;
  @IsOptional() @IsString() @MaxLength(500) cloudinaryPublicId?: string;
  @IsString() @MaxLength(180) altText!: string;
  @IsOptional() @IsString() @MaxLength(500) caption?: string;
  @IsOptional() @IsString() @MaxLength(120) mimeType?: string;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(20_000) width?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(20_000) height?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100 * 1024 * 1024) bytes?: number;
}
