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

class AlumniService {
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

    const { data } =
      await api.post<CompleteAlumniRegistrationResponse>(
        "/alumni/registration/complete",
        formData,
      );

    return data;
  }
}

export default new AlumniService();
