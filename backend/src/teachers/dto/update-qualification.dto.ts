import { PartialType } from '@nestjs/mapped-types';
import { CreateQualificationDto } from './create-qualification.dto.js';

export class UpdateQualificationDto extends PartialType(
  CreateQualificationDto,
) {
  declare qualificationType?: string;
  declare qualificationName?: string;
  declare institution?: string;
  declare specialization?: string;
  declare grade?: string;
  declare yearStarted?: number;
  declare yearCompleted?: number;
  declare certificateNumber?: string;
  declare documentUrl?: string;
}
