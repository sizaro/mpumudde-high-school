import { IsBoolean } from 'class-validator';

export class UpdateParentAccountStatusDto {
  @IsBoolean()
  isActive!: boolean;
}
