import { PartialType } from '@nestjs/mapped-types';
import { CreateEmploymentDto } from './create-employment.dto.js';

export class UpdateEmploymentDto extends PartialType(CreateEmploymentDto) {}
