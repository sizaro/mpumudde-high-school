import api from "../api/axios";

export interface AttendanceRecordInput {
  studentId: string;
  status: "Present" | "Absent" | "Late" | "Excused";
}

export interface AttendanceBulkRecordUpdateInput {
  recordId: string;
  status: AttendanceRecordInput["status"];
}

export interface CreateAttendanceSessionInput {
  classId: string;
  subjectId: string;
  academicYearId?: string;
  termId?: string;
  classSubjectId?: string;
  overrideReason?: string;
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

  async getStudentsForClass(classId: string, academicYearId?: string) {
    const { data } = await api.get(`/attendance/students/class/${classId}`, { params: { academicYearId } });
    return data;
  }

  async updateRecordStatus(sessionId: string, recordId: string, status: AttendanceRecordInput["status"]) {
    const { data } = await api.patch(`/attendance/sessions/${sessionId}/records/${recordId}`, { status });
    return data;
  }

  async updateRecords(sessionId: string, records: AttendanceBulkRecordUpdateInput[]) {
    const { data } = await api.patch(`/attendance/sessions/${sessionId}/records`, { records });
    return data;
  }
}

export default new AttendanceService();
