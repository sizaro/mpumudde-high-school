import api from "../api/axios";

type Term = {
  id: string;
  name: string;
  feeAmount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
};

type StudentTermFee = {
  id: string;
  studentId: string;
  termId: string;
  amountOwed: number;
  amountPaid: number;
  term: Term;
};

class TermsService {
  async createTerm(data: {
    name: string;
    feeAmount: number;
    startDate: string;
    endDate: string;
    isActive?: boolean;
  }): Promise<Term> {
    const { data: response } = await api.post<Term>("/terms", data);
    return response;
  }

  async getAllTerms(): Promise<Term[]> {
    const { data } = await api.get<Term[]>("/terms");
    return data;
  }

  async getActiveTerm(): Promise<Term | null> {
    try {
      const { data } = await api.get<Term>("/terms/active");
      return data;
    } catch {
      return null;
    }
  }

  async assignTermFeeToAllStudents(termId: string) {
    const { data } = await api.post(`/terms/${termId}/assign-all-students`);
    return data;
  }

  async getStudentTermFees(studentId: string): Promise<StudentTermFee[]> {
    const { data } = await api.get<StudentTermFee[]>(`/terms/student/${studentId}/fees`);
    return data;
  }

  async getStudentBalance(studentId: string) {
    const { data } = await api.get(`/finance/students/${studentId}/balance`);
    return data;
  }

  async getStudentsWithBalances() {
    const { data } = await api.get("/finance/students/balances/all");
    return data;
  }
}

export default new TermsService();
