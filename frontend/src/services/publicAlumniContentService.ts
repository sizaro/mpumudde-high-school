import api from "../api/axios";
import type { SchoolEvent, SchoolPublication } from "./contentManagementService";

export type PublicPage<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

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
};

export default publicAlumniContentService;
