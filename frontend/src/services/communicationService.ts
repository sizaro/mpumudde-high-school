import api from '../api/axios';

export type CommunicationAudience = 'EVERYONE' | 'PARENTS' | 'TEACHERS';
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
};

export type SchoolCommunication = {
  id: string;
  subject: string;
  message: string;
  audience: string;
  targeting?: Record<string, unknown> | null;
  status: string;
  sentAt?: string | null;
  sender?: { email: string };
  _count?: { recipients: number };
};

export type CommunicationContact = {
  id: string;
  ownerType: 'PARENT' | 'TEACHER' | 'STUDENT';
  kind: 'EMAIL' | 'PHONE' | 'WHATSAPP';
  value: string;
  isPrimary: boolean;
  isVerified: boolean;
  verifiedAt?: string | null;
  verificationDeliveryStatus?: string | null;
};

class CommunicationService {
  async preview(payload: SendSchoolCommunication): Promise<CommunicationPreview> {
    const { data } = await api.post<CommunicationPreview>('/communications/preview', payload);
    return data;
  }

  async send(payload: SendSchoolCommunication) {
    const { data } = await api.post<SchoolCommunication>('/communications', payload);
    return data;
  }

  async list(): Promise<SchoolCommunication[]> {
    const { data } = await api.get<SchoolCommunication[]>('/communications');
    return data;
  }

  async listMyContacts(): Promise<CommunicationContact[]> {
    const { data } = await api.get<CommunicationContact[]>('/communications/contacts/me');
    return data;
  }

  async requestContactVerification(id: string): Promise<{ contact: CommunicationContact; deliveryStatus: string }> {
    const { data } = await api.post<{ contact: CommunicationContact; deliveryStatus: string }>(`/communications/contacts/${id}/request-verification`);
    return data;
  }

  async confirmContactVerification(id: string, code: string): Promise<CommunicationContact> {
    const { data } = await api.post<CommunicationContact>(`/communications/contacts/${id}/confirm-verification`, { code });
    return data;
  }
}

export default new CommunicationService();
