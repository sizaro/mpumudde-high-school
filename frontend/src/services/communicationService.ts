import api from "../api/axios";

export type CommunicationAudience = "EVERYONE" | "PARENTS" | "STUDENTS" | "TEACHERS" | "ALUMNI";
export type CommunicationFormat = "ANNOUNCEMENT" | "NEWSLETTER" | "INVITATION" | "REMINDER";
export type CommunicationBlock =
  | { type: "heading"; text: string; level?: 1 | 2 | 3 }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[]; ordered?: boolean }
  | { type: "image"; url: string; alt: string; caption?: string }
  | { type: "button"; label: string; url: string }
  | { type: "divider" }
  | { type: "section"; heading: string; body?: string }
  | { type: "event"; title: string; date: string; time?: string; location?: string; description?: string; rsvpUrl?: string }
  | { type: "video"; url: string; title: string; thumbnailUrl?: string; alt?: string };
export type CommunicationContentDocument = { version: 1; blocks: CommunicationBlock[] };

export type SendSchoolCommunication = { audience: CommunicationAudience; subject: string; message?: string; format?: CommunicationFormat; contentDocument?: CommunicationContentDocument; classId?: string; studentIds?: string[]; teacherIds?: string[] };
export type CommunicationPreview = { totalRecipients: number; portalRecipients: number; verifiedEmailRecipients: number; withoutVerifiedEmail: number; withoutAnyDelivery: number; deliveryByRecipientType: Array<{ recipientType: "PARENT" | "STUDENT" | "TEACHER" | "ALUMNI"; totalRecipients: number; portalRecipients: number; verifiedEmailRecipients: number; withoutAnyDelivery: number }> };
export type SchoolCommunication = { id: string; subject: string; message: string; audience: CommunicationAudience; format?: CommunicationFormat; contentDocument?: CommunicationContentDocument | null; targeting?: Record<string, unknown> | null; status: string; sentAt?: string | null; updatedAt?: string; sender?: { email: string }; _count?: { recipients: number } };
export type CommunicationRecipient = { id: string; recipientType: "PARENT" | "STUDENT" | "TEACHER" | "ALUMNI"; recipientId: string; portalUserId?: string | null; emailAddress?: string | null; portalStatus: string; emailStatus: string; emailError?: string | null; deliveredAt?: string | null; portalNotification?: { id: string; isRead: boolean; readAt?: string | null } | null };
export type SchoolCommunicationDetail = SchoolCommunication & { recipients: CommunicationRecipient[] };
export type CommunicationContact = { id: string; ownerType: "PARENT" | "TEACHER" | "STUDENT" | "ALUMNI"; kind: "EMAIL" | "PHONE" | "WHATSAPP"; value: string; isPrimary: boolean; isVerified: boolean; verifiedAt?: string | null; verificationDeliveryStatus?: string | null };
export type RegistrationEmailVerification = { id: string; ownerType: "PARENT" | "TEACHER"; email: string; isVerified: boolean; verifiedAt?: string | null; deliveryStatus?: string | null };

class CommunicationService {
  async preview(payload: SendSchoolCommunication) { return (await api.post<CommunicationPreview>("/communications/preview", payload)).data; }
  async renderPreview(payload: SendSchoolCommunication) { return (await api.post<{ html: string; text: string }>("/communications/preview-render", payload)).data; }
  async send(payload: SendSchoolCommunication) { return (await api.post<SchoolCommunication>("/communications", payload)).data; }
  async list() { return (await api.get<SchoolCommunication[]>("/communications")).data; }
  async get(id: string) { return (await api.get<SchoolCommunicationDetail>(`/communications/${id}`)).data; }
  async listDrafts() { return (await api.get<SchoolCommunication[]>("/communications/drafts")).data; }
  async createDraft(payload: SendSchoolCommunication) { return (await api.post<SchoolCommunication>("/communications/drafts", payload)).data; }
  async updateDraft(id: string, payload: SendSchoolCommunication) { return (await api.put<SchoolCommunication>(`/communications/drafts/${id}`, payload)).data; }
  async sendDraft(id: string) { return (await api.post<SchoolCommunication>(`/communications/drafts/${id}/send`)).data; }
  async sendTest(payload: Pick<SendSchoolCommunication, "subject" | "message" | "format" | "contentDocument"> & { to: string }) { return (await api.post<{ status: string; error?: string; message: string }>("/communications/test-email", payload)).data; }
  async uploadMedia(file: File) { const form = new FormData(); form.append("file", file); return (await api.post<{ url: string; publicId: string; resourceType: "IMAGE" | "VIDEO" }>("/communications/media", form)).data; }
  async listMyContacts() { return (await api.get<CommunicationContact[]>("/communications/contacts/me")).data; }
  async listOwnerContacts(ownerType: CommunicationContact["ownerType"], ownerId: string) { return (await api.get<CommunicationContact[]>("/communications/contacts", { params: { ownerType, ownerId } })).data; }
  async requestContactVerification(id: string) { return (await api.post<{ contact: CommunicationContact; deliveryStatus: string }>(`/communications/contacts/${id}/request-verification`)).data; }
  async confirmContactVerification(id: string, code: string) { return (await api.post<CommunicationContact>(`/communications/contacts/${id}/confirm-verification`, { code })).data; }
  async requestRegistrationEmailVerification(ownerType: "PARENT" | "TEACHER", email: string) { return (await api.post<RegistrationEmailVerification>("/communications/contacts/registration-email-verifications/request", { ownerType, email })).data; }
  async confirmRegistrationEmailVerification(id: string, code: string) { return (await api.post<RegistrationEmailVerification>(`/communications/contacts/registration-email-verifications/${id}/confirm`, { code })).data; }
}
export default new CommunicationService();
