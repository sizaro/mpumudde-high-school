import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString, Matches, Min } from 'class-validator';

export class CreatePayrollPaymentDto {
  @IsString()
  @IsNotEmpty()
  teacherId!: string;

  @IsString()
  @Matches(/^\d{4}-(0[1-9]|1[0-2])$/)
  payrollPeriod!: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  basicSalary!: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  allowances = 0;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  deductions = 0;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  advances = 0;

  @IsString()
  method!: string;

  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() referenceNumber?: string;
  @IsOptional() @IsString() proofUrl?: string;
  @IsOptional() @IsString() proofFileName?: string;
}
