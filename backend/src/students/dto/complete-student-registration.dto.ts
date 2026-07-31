import { CreateStudentDto } from './create-student.dto.js';
import { Allow } from 'class-validator';

export class CompleteStudentRegistrationDto {
  @Allow()
  student!: CreateStudentDto & {
    nationality?: string;
    address?: string;
    previousSchool?: string;
    bloodGroup?: string;
    allergies?: string;
    medicalConditions?: string;
    specialNeeds?: string;
    medicalNotes?: string;
  };
  @Allow()
  primaryGuardian?: {
    fullName: string; relationship?: string; phone?: string; email?: string;
    occupation?: string; address?: string; profilePhoto?: string;
    identityDocumentType?: string; identityDocumentUrl?: string;
  };
  @Allow()
  additionalGuardians?: { name: string; phone?: string }[];
  @Allow()
  payments?: { feeTypeId: string; feeTypeName?: string; academicYearId: string; termId: string; amount: number; method: string; receiptUrl?: string }[];
}
