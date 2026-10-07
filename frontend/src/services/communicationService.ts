import api from "../api/axios";

export type CommunicationAudience =
  | "EVERYONE"
  | "PARENTS"
  | "STUDENTS"
  | "TEACHERS"
  | "ALUMNI";

export type SendSchoolCommunication = {
  audience: CommunicationAudience;
  subject: string;
  message: string;
  classId?: string;
  studentIds?: string[];
  teacherIds?: string[];
};

export type CommunicationPreview = {
  totalRecipients: number;
  portalRecipients: number;
  verifiedEmailRecipients: number;
  withoutVerifiedEmail: number;
  withoutAnyDelivery: number;
  deliveryByRecipientType: Array<{
    recipientType: "PARENT" | "STUDENT" | "TEACHER" | "ALUMNI";
    totalRecipients: number;
    portalRecipients: number;
    verifiedEmailRecipients: number;
    withoutAnyDelivery: number;
  }>;
};

export type SchoolCommunication = {
  id: string;
  subject: string;
  message: string;
  audience: CommunicationAudience;
  targeting?: Record<string, unknown> | null;
  status: string;
  sentAt?: string | null;
  sender?: {
    email: string;
  };
  _count?: {
    recipients: number;
  };
};

export type CommunicationContact = {
  id: string;
  ownerType: "PARENT" | "TEACHER" | "STUDENT" | "ALUMNI";
  kind: "EMAIL" | "PHONE" | "WHATSAPP";
  value: string;
  isPrimary: boolean;
  isVerified: boolean;
  verifiedAt?: string | null;
  verificationDeliveryStatus?: string | null;
};

export type RegistrationEmailVerification = {
  id: string;
  ownerType: "PARENT" | "TEACHER";
  email: string;
  isVerified: boolean;
  verifiedAt?: string | null;
  deliveryStatus?: string | null;
};

class CommunicationService {
  async preview(
    payload: SendSchoolCommunication,
  ): Promise<CommunicationPreview> {
    const { data } = await api.post<CommunicationPreview>(
      "/communications/preview",
      payload,
    );

    return data;
  }

  async send(payload: SendSchoolCommunication): Promise<SchoolCommunication> {
    const { data } = await api.post<SchoolCommunication>(
      "/communications",
      payload,
    );

    return data;
  }

  async list(): Promise<SchoolCommunication[]> {
    const { data } = await api.get<SchoolCommunication[]>("/communications");

    return data;
  }

  async listMyContacts(): Promise<CommunicationContact[]> {
    const { data } = await api.get<CommunicationContact[]>(
      "/communications/contacts/me",
    );

    return data;
  }

  async listOwnerContacts(
    ownerType: CommunicationContact["ownerType"],
    ownerId: string,
  ): Promise<CommunicationContact[]> {
    const { data } = await api.get<CommunicationContact[]>(
      "/communications/contacts",
      { params: { ownerType, ownerId } },
    );
    return data;
  }

  async requestContactVerification(id: string): Promise<{
    contact: CommunicationContact;
    deliveryStatus: string;
  }> {
    const { data } = await api.post<{
      contact: CommunicationContact;
      deliveryStatus: string;
    }>(`/communications/contacts/${id}/request-verification`);

    return data;
  }

  async confirmContactVerification(
    id: string,
    code: string,
  ): Promise<CommunicationContact> {
    const { data } = await api.post<CommunicationContact>(
      `/communications/contacts/${id}/confirm-verification`,
      { code },
    );

    return data;
  }

  async requestRegistrationEmailVerification(
    ownerType: "PARENT" | "TEACHER",
    email: string,
  ): Promise<RegistrationEmailVerification> {
    const { data } = await api.post<RegistrationEmailVerification>(
      "/communications/contacts/registration-email-verifications/request",
      { ownerType, email },
    );
    return data;
  }

  async confirmRegistrationEmailVerification(
    id: string,
    code: string,
  ): Promise<RegistrationEmailVerification> {
    const { data } = await api.post<RegistrationEmailVerification>(
      `/communications/contacts/registration-email-verifications/${id}/confirm`,
      { code },
    );
    return data;
  }
}

export default new CommunicationService();
