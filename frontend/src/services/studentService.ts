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

  async updateStudent(
    id: string,
    student: Partial<Omit<Student, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<Student> {
    const { data } = await api.patch<Student>(`/students/${id}`, student);
    return data;
  }
}

export default new StudentService();
