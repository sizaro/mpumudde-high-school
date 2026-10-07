import { PartialType } from '@nestjs/mapped-types';
import { CreateParentDto } from './create-parent.dto.js';

export class UpdateParentDto extends PartialType(CreateParentDto) {
  declare firstName?: string;
  declare lastName?: string;
  declare gender?: string;
  declare phone?: string;
  declare email?: string;
  declare communicationEmailVerificationId?: string;
  declare address?: string;
  declare occupation?: string;
  declare profilePhoto?: string;
  declare username?: string;
  declare loginEmail?: string;
  declare relationship?: string;
  declare identityDocumentType?: string;
  declare identityDocumentUrl?: string;
  declare studentId?: string;
  declare isPrimary?: boolean;
  declare createLoginAccount?: boolean;
}
