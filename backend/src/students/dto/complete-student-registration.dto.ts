import { CreateStudentDto } from './create-student.dto.js';

export class CompleteStudentRegistrationDto {
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
  primaryGuardian?: {
    fullName: string; relationship?: string; phone?: string; email?: string;
    occupation?: string; address?: string; profilePhoto?: string;
    identityDocumentType?: string; identityDocumentUrl?: string;
  };
  additionalGuardians?: { name: string; phone?: string }[];
  payments?: { feeTypeId: string; academicYearId: string; termId: string; amount: number; method: string; receiptUrl?: string }[];
}
