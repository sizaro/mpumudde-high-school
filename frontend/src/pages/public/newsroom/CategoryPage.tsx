import { useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useParams, useSearchParams } from "react-router-dom";
import { newsroomCategoryLabels, type NewsroomCategory } from "../../../newsroom/types";
import { useNewsroom } from "../../../newsroom/useNewsroom";
import NewsroomCard from "./NewsroomCard";
import NewsroomShell from "./NewsroomShell";

const valid = new Set<NewsroomCategory>(["news", "announcements", "events", "academics", "student-life", "sports", "achievements", "community", "updates", "media"]);
const descriptions: Record<NewsroomCategory, string> = { news: "The newest stories, notices and developments from across the school.", announcements: "Official notices, deadlines and information from the school administration.", events: "School programmes, meetings, competitions and activities.", academics: "Teaching, learning, departments, examinations and academic progress.", "student-life": "Leadership, clubs, welfare and everyday student experiences.", sports: "Teams, fixtures, participation and sportsmanship.", achievements: "Progress and recognition in academics, leadership, service and talent.", community: "Parents, alumni and partnerships surrounding the school.", updates: "Administrative, safety, facilities and operational developments.", media: "Approved photographs, videos and visual stories from school life." };

export default function CategoryPage() {
  const { category: parameter = "news" } = useParams(); const category = valid.has(parameter as NewsroomCategory) ? parameter as NewsroomCategory : "news";
  const [params, setParams] = useSearchParams(); const page = Math.max(1, Number(params.get("page") || 1));
  const query = useMemo(() => ({ ...(category === "news" ? {} : { category }), page, pageSize: 9 }), [category, page]);
  const { result, loading, error } = useNewsroom(query);
  const changePage = (next: number) => { const updated = new URLSearchParams(params); updated.set("page", String(next)); setParams(updated); window.scrollTo({ top: 0, behavior: "smooth" }); };
  return <NewsroomShell><main className="site-container py-12 sm:py-16"><header className="max-w-3xl"><p className="section-badge">Newsroom category</p><h1 className="section-title">{newsroomCategoryLabels[category]}</h1><p className="section-lead">{descriptions[category]}</p></header>{loading ? <p className="py-20 text-center text-slate-500">Loading stories…</p> : error ? <p className="py-20 text-center text-red-600">{error}</p> : <><p className="mt-10 text-sm font-bold text-slate-500">{result.total} published {result.total === 1 ? "item" : "items"}</p><div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">{result.items.map(item => <NewsroomCard key={item.id} item={item} />)}</div>{result.items.length === 0 && <div className="mt-8 rounded-2xl bg-slate-100 p-10 text-center text-slate-600 dark:bg-white/5 dark:text-slate-300">No published items are available in this category yet.</div>}<div className="mt-10 flex items-center justify-center gap-4"><button disabled={page <= 1} onClick={() => changePage(page - 1)} className="public-secondary-button disabled:opacity-40"><ChevronLeft size={17} />Previous</button><span className="text-sm font-bold text-slate-600 dark:text-slate-300">Page {result.page} of {result.totalPages}</span><button disabled={page >= result.totalPages} onClick={() => changePage(page + 1)} className="public-secondary-button disabled:opacity-40">Next<ChevronRight size={17} /></button></div></>}</main></NewsroomShell>;
}
