import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Matches, Max, Min } from 'class-validator';
export class ListExpensesDto {
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page = 1;
  @IsOptional() @Type(() => Number) @IsInt() @Min(5) @Max(100) pageSize = 20;
  @IsOptional() @IsString() search?: string;
  @IsOptional() @Matches(/^\d{4}-\d{2}-\d{2}$/) startDate?: string;
  @IsOptional() @Matches(/^\d{4}-\d{2}-\d{2}$/) endDate?: string;
  @IsOptional() @IsString() category?: string;
  @IsOptional() @IsString() payeeType?: string;
  @IsOptional() @IsString() teacherId?: string;
  @IsOptional() @IsString() method?: string;
  @IsOptional() @IsString() status?: string;
}
