import api from "../api/axios";
import type { CommunicationContentDocument } from "./communicationService";

export type PublicationStatus = "DRAFT" | "IN_REVIEW" | "PUBLISHED" | "ARCHIVED";
export type EventAudience = "ALUMNI" | "PARENTS" | "STUDENTS" | "TEACHERS" | "WHOLE_SCHOOL";
export type EventPublicationStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";
export type EventOperationalStatus = "SCHEDULED" | "POSTPONED" | "CANCELLED" | "COMPLETED";
export type EventRecurrenceRule = "ONE_TIME" | "ANNUAL" | "BIENNIAL" | "IRREGULAR";

export type ManagedImage = {
  id?: string;
  secureUrl: string;
  publicId?: string | null;
  alt: string;
  caption?: string | null;
  mimeType?: string | null;
  width?: number | null;
  height?: number | null;
  bytes?: number | null;
};

export type SchoolPublication = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  category?: string | null;
  status: PublicationStatus;
  isFeatured: boolean;
  contentDocument?: CommunicationContentDocument | null;
  featuredImageUrl?: string | null;
  featuredImagePublicId?: string | null;
  featuredImageAlt?: string | null;
  consentConfirmedAt?: string | null;
  consentNote?: string | null;
  publishedAt?: string | null;
  archivedAt?: string | null;
  updatedAt: string;
  alumni?: { id: string; fullName: string } | null;
  images?: ManagedImage[];
};

export type SchoolEvent = {
  id: string;
  title: string;
  slug: string;
  type: string;
  venue?: string | null;
  descriptionDocument?: CommunicationContentDocument | null;
  startsAt: string;
  endsAt?: string | null;
  recurrenceRule: EventRecurrenceRule;
  series?: { id: string; title: string; recurrenceRule: EventRecurrenceRule } | null;
  visibility: "PUBLIC" | "RESTRICTED";
  publicationStatus: EventPublicationStatus;
  operationalStatus: EventOperationalStatus;
  featuredImageUrl?: string | null;
  featuredImagePublicId?: string | null;
  featuredImageAlt?: string | null;
  audiences: Array<{ id: string; audience: EventAudience; schoolClassId?: string | null; academicYearId?: string | null; stream?: string | null }>;
  images?: ManagedImage[];
  changes?: EventChange[];
  updatedAt: string;
};

export type EventChange = {
  id: string;
  action: string;
  reason?: string | null;
  createdAt: string;
  actor?: { id: string; email: string } | null;
};

export type StoryInput = {
  title: string;
  summary: string;
  category?: string;
  alumniId?: string;
  contentDocument?: CommunicationContentDocument;
  isFeatured?: boolean;
  featuredImageUrl?: string;
  featuredImagePublicId?: string;
  featuredImageAlt?: string;
  consentConfirmed?: boolean;
  consentNote?: string;
};

export type EventInput = {
  title: string;
  type: string;
  venue?: string;
  descriptionDocument?: CommunicationContentDocument;
  startsAt: string;
  endsAt?: string;
  recurrenceRule?: EventRecurrenceRule;
  seriesTitle?: string;
  visibility?: "PUBLIC" | "RESTRICTED";
  featuredImageUrl?: string;
  featuredImagePublicId?: string;
  featuredImageAlt?: string;
  audiences: Array<{ audience: EventAudience }>;
};

const contentManagementService = {
  async uploadContentImage(file: File) {
    const form = new FormData();
    form.append("file", file);
    return (await api.post<{ url: string; publicId: string; mimeType: string; width?: number; height?: number; bytes?: number }>("/content/media/images", form, { headers: { "Content-Type": "multipart/form-data" } })).data;
  },
  async listStories() { return (await api.get<SchoolPublication[]>("/director/publications")).data; },
  async createStory(input: StoryInput) { return (await api.post<SchoolPublication>("/director/publications", input)).data; },
  async updateStory(id: string, input: Partial<StoryInput>) { return (await api.patch<SchoolPublication>(`/director/publications/${id}`, input)).data; },
  async reviewStory(id: string) { return (await api.post<SchoolPublication>(`/director/publications/${id}/review`)).data; },
  async publishStory(id: string) { return (await api.post<SchoolPublication>(`/director/publications/${id}/publish`)).data; },
  async unpublishStory(id: string) { return (await api.post<SchoolPublication>(`/director/publications/${id}/unpublish`)).data; },
  async archiveStory(id: string) { return (await api.post<SchoolPublication>(`/director/publications/${id}/archive`)).data; },

  async listEvents() { return (await api.get<SchoolEvent[]>("/director/events")).data; },
  async getEvent(id: string) { return (await api.get<SchoolEvent>(`/director/events/${id}`)).data; },
  async getEventHistory(id: string) { return (await api.get<EventChange[]>(`/director/events/${id}/history`)).data; },
  async createEvent(input: EventInput) { return (await api.post<SchoolEvent>("/director/events", input)).data; },
  async updateEvent(id: string, input: Partial<EventInput>) { return (await api.patch<SchoolEvent>(`/director/events/${id}`, input)).data; },
  async eventAction(id: string, action: "publish" | "unpublish" | "archive" | "postpone" | "reschedule" | "cancel" | "complete", input: { reason?: string; startsAt?: string; endsAt?: string } = {}) { return (await api.post<SchoolEvent>(`/director/events/${id}/${action}`, input)).data; },
};

export default contentManagementService;
