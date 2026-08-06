import { Type } from "class-transformer";
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from "class-validator";

class AttendanceRecordStatusUpdateDto {
  @IsString()
  @IsNotEmpty()
  recordId!: string;

  @IsString()
  @IsNotEmpty()
  status!: string;
}

export class BulkUpdateAttendanceRecordsDto {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => AttendanceRecordStatusUpdateDto)
  records!: AttendanceRecordStatusUpdateDto[];
}
