import { PartialType } from '@nestjs/mapped-types';
import { CreateTeacherDto } from './create-teacher.dto.js';

export class UpdateTeacherDto extends PartialType(CreateTeacherDto) {
  declare firstName?: string;
  declare middleName?: string;
  declare lastName?: string;
  declare gender?: string;
  declare dateOfBirth?: string;
  declare phone?: string;
  declare email?: string;
  declare communicationEmailVerificationId?: string;
  declare nationality?: string;
  declare address?: string;
  declare profilePhoto?: string;
}
