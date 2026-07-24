export interface Student {
  id: string;
  admissionNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  gender?: string;
  isActive: boolean;
  academicYearId?: string;
  termId?: string;
  classId?: string;
  studentCategoryId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  studentId: string;
  amount: number;
  method: string;
  status: string;
  description?: string | null;
  date: string;
  student?: Student;
  createdAt: string;
  updatedAt: string;
}
