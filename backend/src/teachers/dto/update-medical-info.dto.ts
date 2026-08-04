import { PartialType } from '@nestjs/mapped-types';
import { CreateMedicalInfoDto } from './create-medical-info.dto.js';

export class UpdateMedicalInfoDto extends PartialType(CreateMedicalInfoDto) {}
