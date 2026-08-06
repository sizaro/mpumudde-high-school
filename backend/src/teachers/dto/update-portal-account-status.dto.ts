import { IsBoolean } from "class-validator";

export class UpdateTeacherPortalAccountStatusDto {
  @IsBoolean()
  isActive!: boolean;
}
