import { IsString, IsNumber, IsDateString, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTermDto {
  @IsString()
  name!: string;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  feeAmount!: number;

  @IsDateString()
  startDate!: string;

  @IsDateString()
  endDate!: string;

  @IsOptional()
  @IsOptional()
  isActive?: boolean;
}
