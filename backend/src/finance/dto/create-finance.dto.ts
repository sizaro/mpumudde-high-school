import { IsString, IsNumber, IsOptional, Matches, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateFinanceDto {
  @IsString()
  studentId!: string;

  @IsOptional()
  @IsString()
  studentTermFeeId?: string;

  @IsOptional()
  @IsString()
  studentChargeId?: string;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  amount!: number;

  @IsString()
  method!: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2})?$/)
  date?: string;

  @IsOptional()
  @IsString()
  financeStructureId?: string;

  @IsOptional()
  @IsString()
  feeTypeId?: string;

  @IsOptional()
  @IsString()
  transactionReference?: string;

  @IsOptional()
  @IsString()
  proofUrl?: string;

  @IsOptional()
  @IsString()
  proofFileName?: string;
}
