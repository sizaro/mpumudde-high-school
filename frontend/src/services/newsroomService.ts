import { manualNewsroomContent } from "../newsroom/manualContent";
import type { NewsroomItem, NewsroomQuery, NewsroomResult } from "../newsroom/types";

export interface NewsroomService {
  list(query?: NewsroomQuery): Promise<NewsroomResult>;
  getBySlug(slug: string): Promise<NewsroomItem | null>;
  getFeatured(): Promise<NewsroomItem | null>;
  getLatest(limit?: number): Promise<NewsroomItem[]>;
  getArchive(): Promise<Array<{ year: string; months: string[] }>>;
}

const newestFirst = (items: NewsroomItem[]) => [...items].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

class ManualNewsroomService implements NewsroomService {
  async list(query: NewsroomQuery = {}): Promise<NewsroomResult> {
    const page = Math.max(1, query.page ?? 1);
    const pageSize = Math.max(1, query.pageSize ?? 9);
    const needle = query.search?.trim().toLowerCase();
    const filtered = newestFirst(manualNewsroomContent).filter((item) => {
      const date = new Date(item.publishedAt);
      const matchesSearch = !needle || [item.title, item.excerpt, item.author, ...item.tags].join(" ").toLowerCase().includes(needle);
      return matchesSearch
        && (!query.category || item.category === query.category)
        && (!query.type || item.type === query.type)
        && (!query.year || String(date.getFullYear()) === query.year)
        && (!query.month || String(date.getMonth() + 1).padStart(2, "0") === query.month);
    });
    const start = (page - 1) * pageSize;
    return { items: filtered.slice(start, start + pageSize), total: filtered.length, page, pageSize, totalPages: Math.max(1, Math.ceil(filtered.length / pageSize)) };
  }

  async getBySlug(slug: string) { return manualNewsroomContent.find((item) => item.slug === slug) ?? null; }
  async getFeatured() { return newestFirst(manualNewsroomContent).find((item) => item.featured) ?? null; }
  async getLatest(limit = 6) { return newestFirst(manualNewsroomContent).slice(0, limit); }
  async getArchive() {
    const archive = new Map<string, Set<string>>();
    manualNewsroomContent.forEach(({ publishedAt }) => {
      const date = new Date(publishedAt); const year = String(date.getFullYear()); const month = String(date.getMonth() + 1).padStart(2, "0");
      if (!archive.has(year)) archive.set(year, new Set()); archive.get(year)?.add(month);
    });
    return [...archive.entries()].sort(([a], [b]) => b.localeCompare(a)).map(([year, months]) => ({ year, months: [...months].sort().reverse() }));
  }
}

// Replace this instance with an Axios-backed implementation when the Newsroom API is ready.
export const newsroomService: NewsroomService = new ManualNewsroomService();
