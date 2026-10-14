import { IsIn, IsObject, IsOptional, IsString, MaxLength } from "class-validator";
import { SendSchoolCommunicationDto } from "./send-school-communication.dto.js";

export class SaveSchoolCommunicationDraftDto extends SendSchoolCommunicationDto {
  @IsOptional()
  @IsString()
  @MaxLength(180)
  declare subject: string;

  @IsOptional()
  @IsObject()
  declare contentDocument?: Record<string, unknown>;
}

export class SendSchoolCommunicationTestDto {
  @IsString()
  @MaxLength(320)
  to!: string;

  @IsString()
  @MaxLength(180)
  subject!: string;

  @IsOptional()
  @IsString()
  @MaxLength(12_000)
  message?: string;

  @IsOptional()
  @IsIn(["ANNOUNCEMENT", "NEWSLETTER", "INVITATION", "REMINDER"])
  format?: "ANNOUNCEMENT" | "NEWSLETTER" | "INVITATION" | "REMINDER";

  @IsOptional()
  @IsObject()
  contentDocument?: Record<string, unknown>;
}
