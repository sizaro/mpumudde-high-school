import { IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateExpenseDto {
  @IsString() category!: string;
  @Type(() => Number) @IsInt() @Min(1) amount!: number;
  @IsString() payeeType!: string;
  @IsString() payeeName!: string;
  @IsOptional() @IsString() teacherId?: string;
  @IsString() method!: string;
  @IsOptional() @IsString() expenseDate?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() referenceNumber?: string;
  @IsOptional() @IsString() proofUrl?: string;
  @IsOptional() @IsString() proofFileName?: string;
}

export class ExpenseDecisionDto {
  @IsIn(['APPROVED', 'REJECTED', 'PAID', 'CANCELLED']) status!: string;
  @IsOptional() @IsString() reason?: string;
}
