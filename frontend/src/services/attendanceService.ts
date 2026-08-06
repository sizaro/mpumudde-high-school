import api from "../api/axios";

export interface AttendanceRecordInput {
  studentId: string;
  status: "Present" | "Absent" | "Late" | "Excused";
}

export interface CreateAttendanceSessionInput {
  classId: string;
  subjectId: string;
  date?: string;
  records: AttendanceRecordInput[];
}

class AttendanceService {
  async createSession(dto: CreateAttendanceSessionInput) {
    const { data } = await api.post("/attendance/sessions", dto);
    return data;
  }

  async findAll() {
    const { data } = await api.get("/attendance/sessions");
    return data;
  }

  async findMine() {
    const { data } = await api.get("/attendance/sessions/mine");
    return data;
  }

  async findByClass(classId: string) {
    const { data } = await api.get(`/attendance/sessions/class/${classId}`);
    return data;
  }

  async findOne(id: string) {
    const { data } = await api.get(`/attendance/sessions/${id}`);
    return data;
  }

  async updateRecordStatus(
    sessionId: string,
    recordId: string,
    status: AttendanceRecordInput["status"],
  ) {
    const { data } = await api.patch(
      `/attendance/sessions/${sessionId}/records/${recordId}`,
      { status },
    );
    return data;
  }

  async getStudentsForClass(classId: string) {
    const { data } = await api.get(`/attendance/students/class/${classId}`);
    return data;
  }
}

export default new AttendanceService();
