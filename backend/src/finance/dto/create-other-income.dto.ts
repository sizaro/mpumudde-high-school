import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateOtherIncomeDto {
  @IsString() @IsNotEmpty() category!: string;
  @Type(() => Number) @IsInt() @Min(1) amount!: number;
  @IsString() @IsNotEmpty() source!: string;
  @IsString() @IsNotEmpty() method!: string;
  @IsOptional() @IsDateString() incomeDate?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() referenceNumber?: string;
  @IsOptional() @IsString() proofUrl?: string;
  @IsOptional() @IsString() proofFileName?: string;
}
