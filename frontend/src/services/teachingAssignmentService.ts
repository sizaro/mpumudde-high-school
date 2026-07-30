import api from "../api/axios";

class TeachingAssignmentService {
  async create(teacherId: string, classId: string, subjectId: string) {
    const { data } = await api.post("/teaching-assignments", { teacherId, classId, subjectId });
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
