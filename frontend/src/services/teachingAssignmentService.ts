import api from "../api/axios";

class TeachingAssignmentService {
  async create(payload: { teacherId: string; subjectId: string; academicYearId: string; academicYearClassId: string; classSubjectId: string; startDate?: string; endDate?: string }) {
    const { data } = await api.post("/teaching-assignments", payload);
    return data;
  }

  async findAll() {
    const { data } = await api.get("/teaching-assignments");
    return data;
  }

  async findByTeacher(teacherId: string) {
    const { data } = await api.get(`/teaching-assignments/teacher/${teacherId}`);
    return data;
  }

  async remove(id: string) {
    const { data } = await api.delete(`/teaching-assignments/${id}`);
    return data;
  }
}

export default new TeachingAssignmentService();
