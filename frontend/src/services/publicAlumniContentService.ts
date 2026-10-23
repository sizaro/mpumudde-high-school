import api from "../api/axios";
import type { SchoolEvent, SchoolPublication } from "./contentManagementService";

export type PublicPage<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type EventRsvpInput = { fullName: string; email: string; attendance?: "GOING" | "MAYBE" | "DECLINED"; guestCount?: number; note?: string; };
export type EventRsvpRecord = { id: string; fullName: string; email: string; status: string; requestedAttendance: string; guestCount: number; note?: string | null; confirmedAt?: string | null; updatedAt: string; event?: { title: string; slug: string; startsAt: string; venue?: string | null } };

export type AlumniCommunitySummary = {
  registeredAlumni: number;
  publishedStories: number;
  upcomingEvents: number;
};

const publicAlumniContentService = {
  async summary() { return (await api.get<AlumniCommunitySummary>("/alumni/community-summary")).data; },
  async stories(page = 1, pageSize = 9, featured?: boolean) {
    return (await api.get<PublicPage<SchoolPublication>>("/publications/alumni-stories", { params: { page, pageSize, ...(featured === undefined ? {} : { featured }) } })).data;
  },
  async story(slug: string) { return (await api.get<SchoolPublication>(`/publications/alumni-stories/${slug}`)).data; },
  async events(page = 1, pageSize = 9) { return (await api.get<PublicPage<SchoolEvent>>("/events/alumni", { params: { page, pageSize } })).data; },
  async event(slug: string) { return (await api.get<SchoolEvent>(`/events/alumni/${slug}`)).data; },
  async requestRsvp(slug: string, input: EventRsvpInput) { return (await api.post<{ success: boolean; message: string }>(`/events/alumni/${slug}/rsvp`, input)).data; },
  async confirmRsvp(token: string) { return (await api.post<{ success: boolean; status: string; message: string }>("/events/rsvp/confirm", { token })).data; },
  async managedRsvp(token: string) { return (await api.get<EventRsvpRecord>("/events/rsvp/manage", { params: { token } })).data; },
  async updateManagedRsvp(token: string, input: Pick<EventRsvpInput, "attendance" | "guestCount" | "note">) { return (await api.patch<EventRsvpRecord>("/events/rsvp/manage", input, { params: { token } })).data; },
};

export default publicAlumniContentService;
