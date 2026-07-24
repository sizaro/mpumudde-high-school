import api from "../api/axios";

export type AcademicYear = { id: string; name: string; isActive: boolean; createdAt?: string; updatedAt?: string };
export type Term = { id: string; name: string; academicYearId: string; academicYear?: AcademicYear; feeAmount: number; startDate?: string; endDate?: string; isActive: boolean };
export type SchoolClass = { id: string; name: string; isActive: boolean };
export type StudentCategory = { id: string; name: string; isActive: boolean };
export type FeeType = { id: string; name: string; isActive: boolean };
export type FinanceStructure = { id: string; academicYearId: string; termId: string; classId: string; studentCategoryId: string; feeTypeId: string; expectedAmount: number; academicYear?: AcademicYear; term?: Term; schoolClass?: SchoolClass; studentCategory?: StudentCategory; feeType?: FeeType };

class SetupService {
  async getAcademicYears(): Promise<AcademicYear[]> {
    const { data } = await api.get<AcademicYear[]>("/setup/academic-years");
    return data;
  }

  async createAcademicYear(payload: { name: string; isActive?: boolean }): Promise<AcademicYear> {
    const { data } = await api.post<AcademicYear>("/setup/academic-years", payload);
    return data;
  }

  async updateAcademicYear(id: string, payload: Partial<AcademicYear>): Promise<AcademicYear> {
    const { data } = await api.patch<AcademicYear>(`/setup/academic-years/${id}`, payload);
    return data;
  }

  async getTerms(): Promise<Term[]> {
    const { data } = await api.get<Term[]>("/setup/terms");
    return data;
  }

  async createTerm(payload: { academicYearId: string; name: string; feeAmount?: number; startDate?: string; endDate?: string; isActive?: boolean }): Promise<Term> {
    const { data } = await api.post<Term>("/setup/terms", payload);
    return data;
  }

  async updateTerm(id: string, payload: Partial<Term>): Promise<Term> {
    const { data } = await api.patch<Term>(`/setup/terms/${id}`, payload);
    return data;
  }

  async getClasses(): Promise<SchoolClass[]> {
    const { data } = await api.get<SchoolClass[]>("/setup/classes");
    return data;
  }

  async createClass(payload: { name: string; isActive?: boolean }): Promise<SchoolClass> {
    const { data } = await api.post<SchoolClass>("/setup/classes", payload);
    return data;
  }

  async updateClass(id: string, payload: Partial<SchoolClass>): Promise<SchoolClass> {
    const { data } = await api.patch<SchoolClass>(`/setup/classes/${id}`, payload);
    return data;
  }

  async getStudentCategories(): Promise<StudentCategory[]> {
    const { data } = await api.get<StudentCategory[]>("/setup/student-categories");
    return data;
  }

  async createStudentCategory(payload: { name: string; isActive?: boolean }): Promise<StudentCategory> {
    const { data } = await api.post<StudentCategory>("/setup/student-categories", payload);
    return data;
  }

  async updateStudentCategory(id: string, payload: Partial<StudentCategory>): Promise<StudentCategory> {
    const { data } = await api.patch<StudentCategory>(`/setup/student-categories/${id}`, payload);
    return data;
  }

  async getFeeTypes(): Promise<FeeType[]> {
    const { data } = await api.get<FeeType[]>("/setup/fee-types");
    return data;
  }

  async createFeeType(payload: { name: string; isActive?: boolean }): Promise<FeeType> {
    const { data } = await api.post<FeeType>("/setup/fee-types", payload);
    return data;
  }

  async updateFeeType(id: string, payload: Partial<FeeType>): Promise<FeeType> {
    const { data } = await api.patch<FeeType>(`/setup/fee-types/${id}`, payload);
    return data;
  }

  async getFinanceStructures(): Promise<FinanceStructure[]> {
    const { data } = await api.get<FinanceStructure[]>("/setup/finance-structures");
    return data;
  }

  async createFinanceStructure(payload: { academicYearId: string; termId: string; classId: string; studentCategoryId: string; feeTypeId: string; expectedAmount: number }): Promise<FinanceStructure> {
    const { data } = await api.post<FinanceStructure>("/setup/finance-structures", payload);
    return data;
  }

  async updateFinanceStructure(id: string, payload: Partial<FinanceStructure>): Promise<FinanceStructure> {
    const { data } = await api.patch<FinanceStructure>(`/setup/finance-structures/${id}`, payload);
    return data;
  }

  async getRegistrationData() {
    const { data } = await api.get("/setup/registration-data");
    return data;
  }
}

export default new SetupService();