import { PartialType } from '@nestjs/mapped-types';
import { CreateFeeStructureDto } from './create-fee-structure.dto.js';

export class UpdateFeeStructureDto extends PartialType(CreateFeeStructureDto) {}
