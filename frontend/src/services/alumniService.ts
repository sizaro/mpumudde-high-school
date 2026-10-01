import api from "../api/axios";

export type StartAlumniRegistrationResponse = {
  success: boolean;
  message: string;
};

export type VerifyAlumniRegistrationResponse = {
  valid: boolean;
  email: string;
};

export type CompleteAlumniRegistrationInput = {
  token: string;
  fullName: string;
  graduationYear?: number;
  studentPeriod?: string;
  whatsappNumber?: string;
  rememberedPerson?: string;
  profileImage?: File | null;
};

export type CompleteAlumniRegistrationResponse = {
  success: boolean;
  message: string;
  alumni: {
    id: string;
    email: string;
    fullName: string;
    graduationYear: number | null;
    studentPeriod: string | null;
    whatsappNumber: string | null;
    profileImageUrl: string | null;
    rememberedPerson: string | null;
    possibleStudentMatch: boolean;
  };
  welcomeEmailStatus: "SENT" | "FAILED" | "NOT_CONFIGURED";
};

// ============================================================
// DIRECTOR ALUMNI TYPES
// ============================================================

export type AlumniCommunicationContact = {
  id: string;
  ownerType?: string;
  ownerId?: string;
  kind?: string;
  value: string;
  normalizedValue?: string;
  label?: string | null;
  isPrimary: boolean;
  isActive: boolean;
  isVerified: boolean;
  verifiedAt?: string | null;
  verificationDeliveryStatus?: string | null;
  verificationDeliveryError?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type DirectorAlumni = {
  id: string;
  email: string;
  fullName: string;
  graduationYear: number | null;
  studentPeriod: string | null;
  whatsappNumber: string | null;
  profileImageUrl: string | null;
  profileImagePublicId?: string | null;
  rememberedPerson: string | null;

  isActive: boolean;
  lockedAt: string | null;
  lockedReason: string | null;

  possibleStudentMatch: boolean;
  possibleStudentMatchDetails: string | null;

  createdAt: string;
  updatedAt: string;

  contacts: AlumniCommunicationContact[];
  primaryEmailVerified: boolean;
};

export type UpdateAlumniInput = {
  fullName?: string;
  graduationYear?: number | null;
  studentPeriod?: string | null;
  whatsappNumber?: string | null;
  rememberedPerson?: string | null;
};

export type UpdateAlumniStatusInput = {
  locked: boolean;
  reason?: string;
};

export type ArchiveAlumniResponse = {
  success: boolean;
  message: string;
};

// ============================================================
// SERVICE
// ============================================================

class AlumniService {
  // ============================================================
  // PUBLIC REGISTRATION
  // ============================================================

  async startRegistration(
    email: string,
  ): Promise<StartAlumniRegistrationResponse> {
    const { data } = await api.post<StartAlumniRegistrationResponse>(
      "/alumni/registration/start",
      { email },
    );

    return data;
  }

  async verifyRegistrationToken(
    token: string,
  ): Promise<VerifyAlumniRegistrationResponse> {
    const { data } = await api.get<VerifyAlumniRegistrationResponse>(
      "/alumni/registration/verify",
      {
        params: { token },
      },
    );

    return data;
  }

  async completeRegistration(
    input: CompleteAlumniRegistrationInput,
  ): Promise<CompleteAlumniRegistrationResponse> {
    const formData = new FormData();

    formData.append("token", input.token);
    formData.append("fullName", input.fullName);

    if (input.graduationYear !== undefined) {
      formData.append("graduationYear", String(input.graduationYear));
    }

    if (input.studentPeriod?.trim()) {
      formData.append("studentPeriod", input.studentPeriod.trim());
    }

    if (input.whatsappNumber?.trim()) {
      formData.append("whatsappNumber", input.whatsappNumber.trim());
    }

    if (input.rememberedPerson?.trim()) {
      formData.append("rememberedPerson", input.rememberedPerson.trim());
    }

    if (input.profileImage) {
      formData.append("profileImage", input.profileImage);
    }

    const { data } = await api.post<CompleteAlumniRegistrationResponse>(
      "/alumni/registration/complete",
      formData,
    );

    return data;
  }

  // ============================================================
  // DIRECTOR ALUMNI MANAGEMENT
  // ============================================================

  async getAlumni(): Promise<DirectorAlumni[]> {
    const { data } = await api.get<DirectorAlumni[]>("/alumni");

    return data;
  }

  async getAlumniById(id: string): Promise<DirectorAlumni> {
    const { data } = await api.get<DirectorAlumni>(`/alumni/${id}`);

    return data;
  }

  async updateAlumni(
    id: string,
    input: UpdateAlumniInput,
  ): Promise<DirectorAlumni> {
    const { data } = await api.patch<DirectorAlumni>(`/alumni/${id}`, input);

    return data;
  }

  async updateAlumniStatus(
    id: string,
    input: UpdateAlumniStatusInput,
  ): Promise<DirectorAlumni> {
    const { data } = await api.patch<DirectorAlumni>(
      `/alumni/${id}/status`,
      input,
    );

    return data;
  }

  async archiveAlumni(id: string): Promise<ArchiveAlumniResponse> {
    const { data } = await api.delete<ArchiveAlumniResponse>(`/alumni/${id}`);

    return data;
  }
}

export default new AlumniService();
