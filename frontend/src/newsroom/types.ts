export type NewsroomCategory = "news" | "announcements" | "events" | "academics" | "student-life" | "sports" | "achievements" | "community" | "updates" | "media";
export type NewsroomContentType = "article" | "announcement" | "event" | "media";

export type NewsroomItem = {
  id: string;
  slug: string;
  type: NewsroomContentType;
  category: NewsroomCategory;
  title: string;
  excerpt: string;
  body: string[];
  image: string;
  imageAlt: string;
  publishedAt: string;
  author: string;
  readMinutes: number;
  featured?: boolean;
  priority?: "normal" | "important" | "urgent";
  eventDate?: string;
  eventTime?: string;
  eventLocation?: string;
  tags: string[];
};

export type NewsroomQuery = {
  category?: NewsroomCategory;
  type?: NewsroomContentType;
  search?: string;
  year?: string;
  month?: string;
  page?: number;
  pageSize?: number;
};

export type NewsroomResult = {
  items: NewsroomItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export const newsroomCategoryLabels: Record<NewsroomCategory, string> = {
  news: "Latest News",
  announcements: "Announcements",
  events: "Events",
  academics: "Academics",
  "student-life": "Student Life",
  sports: "Sports",
  achievements: "Achievements",
  community: "Community",
  updates: "School Updates",
  media: "Media",
};
