import { Transform } from "class-transformer";
import {
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  Max,
} from "class-validator";

export class CompleteAlumniRegistrationDto {
  @IsString()
  @MaxLength(128)
  token!: string;

  @IsString()
  @MaxLength(160)
  fullName!: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === undefined || value === null || value === "") {
      return undefined;
    }

    return Number(value);
  })
  @IsInt()
  @Min(1900)
  @Max(2100)
  graduationYear?: number;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  studentPeriod?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  whatsappNumber?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  rememberedPerson?: string;
}
