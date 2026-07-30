import api from "../api/axios";

export interface TeacherPersonal {
  firstName: string;
  middleName?: string;
  lastName: string;
  gender?: string;
  dateOfBirth?: string;
  phone?: string;
  email?: string;
  nationality?: string;
  address?: string;
  profilePhoto?: string;
}

export interface TeacherAccount { email: string; }

export interface EmploymentInfo {
  employeeNumber: string;
  position?: string;
  department?: string;
  employmentType?: string;
  employmentDate?: string;
  probationEndDate?: string;
  salary?: number;
  status?: string;
}

export interface EmergencyContact {
  fullName: string;
  relationship: string;
  phone: string;
  alternativePhone?: string;
  address?: string;
  isNextOfKin?: boolean;
}

export interface MedicalInfo {
  bloodGroup?: string;
  allergies?: string;
  medicalConditions?: string;
  medication?: string;
  disability?: string;
  notes?: string;
}

export interface Qualification {
  qualificationType?: string;
  qualificationName: string;
  institution: string;
  specialization?: string;
  grade?: string;
  yearStarted?: number;
  yearCompleted?: number;
  certificateNumber?: string;
  documentUrl?: string;
}

export interface TeacherDocument {
  documentCategoryId: string;
  originalFileName: string;
  fileUrl: string;
  title?: string;
  description?: string;
  fileExtension?: string;
  mimeType?: string;
  fileSize?: number;
}

class TeacherService {
  // ── Director ─────────────────────────────────────────────
  async createWithAccount(personal: TeacherPersonal, account: TeacherAccount) {
    const { data } = await api.post("/teachers", { personal, account });
    return data;
  }

  async findAll() {
    const { data } = await api.get("/teachers");
    return data;
  }

  async findOne(id: string) {
    const { data } = await api.get(`/teachers/${id}`);
    return data;
  }

  async updatePersonal(id: string, dto: Partial<TeacherPersonal>) {
    const { data } = await api.patch(`/teachers/${id}/personal`, dto);
    return data;
  }

  async upsertEmployment(id: string, dto: EmploymentInfo) {
    const { data } = await api.put(`/teachers/${id}/employment`, dto);
    return data;
  }

  async upsertMedical(id: string, dto: MedicalInfo) {
    const { data } = await api.put(`/teachers/${id}/medical`, dto);
    return data;
  }

  async addContact(id: string, dto: EmergencyContact) {
    const { data } = await api.post(`/teachers/${id}/contacts`, dto);
    return data;
  }

  async updateContact(teacherId: string, contactId: string, dto: Partial<EmergencyContact>) {
    const { data } = await api.patch(`/teachers/${teacherId}/contacts/${contactId}`, dto);
    return data;
  }

  async removeContact(teacherId: string, contactId: string) {
    const { data } = await api.delete(`/teachers/${teacherId}/contacts/${contactId}`);
    return data;
  }

  async addQualification(id: string, dto: Qualification) {
    const { data } = await api.post(`/teachers/${id}/qualifications`, dto);
    return data;
  }

  async updateQualification(teacherId: string, qualId: string, dto: Partial<Qualification>) {
    const { data } = await api.patch(`/teachers/${teacherId}/qualifications/${qualId}`, dto);
    return data;
  }

  async removeQualification(teacherId: string, qualId: string) {
    const { data } = await api.delete(`/teachers/${teacherId}/qualifications/${qualId}`);
    return data;
  }

  async getDocuments(id: string) {
    const { data } = await api.get(`/teachers/${id}/documents`);
    return data;
  }

  async addDocument(id: string, dto: TeacherDocument) {
    const { data } = await api.post(`/teachers/${id}/documents`, dto);
    return data;
  }

  async removeDocument(teacherId: string, docId: string) {
    const { data } = await api.delete(`/teachers/${teacherId}/documents/${docId}`);
    return data;
  }

  async deactivate(id: string) {
    const { data } = await api.patch(`/teachers/${id}/deactivate`);
    return data;
  }

  async remove(id: string) {
    const { data } = await api.delete(`/teachers/${id}`);
    return data;
  }

  // ── Teacher (self) ────────────────────────────────────────
  async getMyProfile() {
    const { data } = await api.get("/teachers/me/profile");
    return data;
  }

  async getMyClasses() {
    const { data } = await api.get("/teachers/me/classes");
    return data;
  }

  async getMySubjects() {
    const { data } = await api.get("/teachers/me/subjects");
    return data;
  }

  async getMyAssignments() {
    const { data } = await api.get("/teachers/me/assignments");
    return data;
  }
}

export default new TeacherService();
