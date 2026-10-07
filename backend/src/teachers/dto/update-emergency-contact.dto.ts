import { PartialType } from '@nestjs/mapped-types';
import { CreateEmergencyContactDto } from './create-emergency-contact.dto.js';

export class UpdateEmergencyContactDto extends PartialType(
  CreateEmergencyContactDto,
) {
  declare fullName?: string;
  declare relationship?: string;
  declare phone?: string;
  declare alternativePhone?: string;
  declare address?: string;
  declare isNextOfKin?: boolean;
}
