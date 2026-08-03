import { useEffect, useState } from "react";
import { ArrowRight, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { formatNewsDate } from "../../newsroom/format";
import { newsroomCategoryLabels, type NewsroomItem } from "../../newsroom/types";
import { newsroomService } from "../../services/newsroomService";
import { AnimatedSection } from "../AnimatedSection";

export default function LatestNews() {
  const [news, setNews] = useState<NewsroomItem[]>([]);
  useEffect(() => { let active = true; void newsroomService.getLatest(3).then(items => { if (active) setNews(items); }); return () => { active = false; }; }, []);
  return <section className="home-section"><AnimatedSection delay={0.2}><div className="site-container"><div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between"><div><span className="section-badge">Latest News</span><h2 className="section-title">Stay connected with school life</h2><p className="section-lead">Read the latest stories, official notices and school developments.</p></div><Link to="/newsroom/news" className="inline-flex items-center gap-2 font-bold text-[var(--brand-green)]">Visit the Newsroom <ArrowRight size={18} /></Link></div><div className="grid gap-7 md:grid-cols-3">{news.map(item => <Link key={item.id} to={`/newsroom/articles/${item.slug}`} className="group overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-[0_16px_40px_rgba(15,23,42,.06)] dark:border-white/10 dark:bg-white/[.045]"><div className="h-52 overflow-hidden"><img src={item.image} alt={item.imageAlt} loading="lazy" decoding="async" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]" /></div><div className="p-6"><div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold"><span className="rounded-full bg-emerald-50 px-3 py-1.5 text-emerald-800 dark:bg-emerald-400/10 dark:text-emerald-200">{newsroomCategoryLabels[item.category]}</span><span className="flex items-center gap-1 text-slate-500"><Calendar size={14} />{formatNewsDate(item.publishedAt)}</span></div><h3 className="mt-4 text-xl font-black leading-tight text-slate-950 dark:text-white">{item.title}</h3><p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{item.excerpt}</p><span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-[var(--brand-green)]">Read story <ArrowRight size={16} /></span></div></Link>)}</div></div></AnimatedSection></section>;
}
