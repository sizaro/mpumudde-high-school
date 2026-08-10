import api from "../api/axios";
import type { Student } from "../types/api.types";

class StudentService {
  async getStudents(): Promise<Student[]> {
    const { data } = await api.get<Student[]>("/students");
    return data;
  }

  async createStudent(student: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>): Promise<Student> {
    const { data } = await api.post<Student>("/students", student);
    return data;
  }

  async uploadPhoto(file: FormData): Promise<{ url: string; originalName?: string; mimeType?: string; fileSize?: number; fileExtension?: string }> {
    const { data } = await api.post<{ url: string; originalName?: string; mimeType?: string; fileSize?: number; fileExtension?: string }>("/upload", file, { headers: { "Content-Type": "multipart/form-data" } });
    return data;
  }

  async createCompleteRegistration(payload: Record<string, unknown>): Promise<{ student: Student; guardianCredentials?: { email: string; temporaryPassword: string } }> {
    const { data } = await api.post<{ student: Student; guardianCredentials?: { email: string; temporaryPassword: string } }>("/students/complete-registration", payload);
    return data;
  }

  async updateStudent(
    id: string,
    student: Partial<Omit<Student, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<Student> {
    const { data } = await api.patch<Student>(`/students/${id}`, student);
    return data;
  }

  async getStudent(studentId: string): Promise<Student> {
    const { data } = await api.get<Student>(`/students/${studentId}`);
    return data;
  }

  async getStudentFinanceSummary(studentId: string) {
    const { data } = await api.get(`/students/${studentId}/finance-summary`);
    return data;
  }

  async deleteStudent(studentId: string): Promise<void> {
    await api.delete(`/students/${studentId}`);
  }
}

export default new StudentService();
