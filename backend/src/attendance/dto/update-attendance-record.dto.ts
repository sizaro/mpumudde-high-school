import { IsNotEmpty, IsString } from "class-validator";

export class UpdateAttendanceRecordDto {
  @IsString()
  @IsNotEmpty()
  status!: string;
}
