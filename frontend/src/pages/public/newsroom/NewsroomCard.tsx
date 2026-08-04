import { ArrowRight, CalendarDays, Clock3, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { formatNewsDate } from "../../../newsroom/format";
import { newsroomCategoryLabels, type NewsroomItem } from "../../../newsroom/types";

export default function NewsroomCard({ item, compact = false }: { item: NewsroomItem; compact?: boolean }) {
  return (
    <article className={`group overflow-hidden rounded-[1.35rem] border border-slate-200 bg-white shadow-[0_16px_40px_rgba(15,23,42,.06)] dark:border-white/10 dark:bg-white/[.045] ${compact ? "grid sm:grid-cols-[12rem_1fr]" : ""}`}>
      <Link to={`/newsroom/articles/${item.slug}`} className={`block overflow-hidden bg-slate-100 ${compact ? "min-h-52" : "h-56"}`}><img src={item.image} alt={item.imageAlt} loading="lazy" decoding="async" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]" /></Link>
      <div className="p-6">
        <div className="flex flex-wrap items-center gap-3 text-xs font-bold"><Link to={`/newsroom/${item.category}`} className="rounded-full bg-emerald-50 px-3 py-1.5 text-emerald-800 dark:bg-emerald-400/10 dark:text-emerald-200">{newsroomCategoryLabels[item.category]}</Link><span className="text-slate-500 dark:text-slate-400">{formatNewsDate(item.publishedAt)}</span></div>
        <h2 className={`${compact ? "text-xl" : "text-2xl"} mt-4 font-black leading-tight text-slate-950 dark:text-white`}><Link to={`/newsroom/articles/${item.slug}`}>{item.title}</Link></h2>
        <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{item.excerpt}</p>
        {item.type === "event" && <div className="mt-4 grid gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300"><span className="flex items-center gap-2"><CalendarDays size={14} />{item.eventDate}</span><span className="flex items-center gap-2"><Clock3 size={14} />{item.eventTime}</span><span className="flex items-center gap-2"><MapPin size={14} />{item.eventLocation}</span></div>}
        <Link to={`/newsroom/articles/${item.slug}`} className="mt-5 inline-flex items-center gap-2 text-sm font-black text-[var(--brand-green)]">Read story <ArrowRight size={16} /></Link>
      </div>
    </article>
  );
}
