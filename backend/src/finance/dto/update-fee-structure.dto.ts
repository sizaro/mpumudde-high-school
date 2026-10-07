import { PartialType } from '@nestjs/mapped-types';
import { CreateFeeStructureDto } from './create-fee-structure.dto.js';

export class UpdateFeeStructureDto extends PartialType(CreateFeeStructureDto) {
  declare academicYearId?: string;
  declare termId?: string;
  declare classId?: string;
  declare studentCategoryId?: string;
  declare feeTypeId?: string;
  declare expectedAmount?: number;
  declare isActive?: boolean;
}
