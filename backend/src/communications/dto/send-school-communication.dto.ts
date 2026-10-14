import { ArrayMaxSize, IsArray, IsIn, IsObject, IsOptional, IsString, MaxLength } from "class-validator";

export class SendSchoolCommunicationDto {
  @IsString()
  @IsIn(["EVERYONE", "PARENTS", "STUDENTS", "TEACHERS", "ALUMNI"])
  audience!: "EVERYONE" | "PARENTS" | "STUDENTS" | "TEACHERS" | "ALUMNI";

  @IsString()
  @MaxLength(180)
  subject!: string;

  /** Legacy plain-text content remains accepted for existing clients. */
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

  @IsOptional()
  @IsString()
  classId?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(500)
  @IsString({ each: true })
  studentIds?: string[];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(500)
  @IsString({ each: true })
  teacherIds?: string[];
}
