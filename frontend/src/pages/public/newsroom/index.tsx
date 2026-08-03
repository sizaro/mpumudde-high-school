import { useEffect, useState } from "react";
import { ArrowRight, Bell, CalendarDays, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { newsroomService } from "../../../services/newsroomService";
import type { NewsroomItem } from "../../../newsroom/types";
import NewsroomCard from "./NewsroomCard";
import NewsroomShell from "./NewsroomShell";

export default function NewsroomHome() {
  const [featured, setFeatured] = useState<NewsroomItem | null>(null);
  const [latest, setLatest] = useState<NewsroomItem[]>([]);
  const [announcements, setAnnouncements] = useState<NewsroomItem[]>([]);
  const [events, setEvents] = useState<NewsroomItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    void Promise.all([newsroomService.getFeatured(), newsroomService.getLatest(7), newsroomService.list({ category: "announcements", pageSize: 3 }), newsroomService.list({ category: "events", pageSize: 3 })]).then(([lead, recent, notices, upcoming]) => {
      if (!active) return; setFeatured(lead); setLatest(recent.filter((item) => item.id !== lead?.id).slice(0, 6)); setAnnouncements(notices.items); setEvents(upcoming.items);
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  return (
    <NewsroomShell>
      <main>
        {loading ? <div className="site-container py-24 text-center text-slate-500">Loading Newsroom…</div> : <>
          {featured && <section className="site-container py-10 sm:py-14">
            <article className="grid overflow-hidden rounded-[2rem] bg-[var(--brand-ink)] text-white lg:grid-cols-[1.15fr_.85fr]">
              <div className="relative min-h-[22rem] lg:min-h-[32rem]"><img src={featured.image} alt={featured.imageAlt} className="absolute inset-0 h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 to-transparent" /></div>
              <div className="flex flex-col justify-center p-8 sm:p-12"><p className="text-xs font-black uppercase tracking-[.2em] text-emerald-300">Featured story</p><h1 className="mt-5 text-3xl font-black leading-tight sm:text-5xl">{featured.title}</h1><p className="mt-5 leading-8 text-slate-300">{featured.excerpt}</p><Link to={`/newsroom/articles/${featured.slug}`} className="mt-8 inline-flex items-center gap-2 font-black text-emerald-300">Read the full story <ArrowRight size={18} /></Link></div>
            </article>
          </section>}

          <section className="site-container pb-14"><div className="flex items-end justify-between gap-4"><div><p className="section-badge">Highlights</p><h2 className="mt-4 text-3xl font-black text-slate-950 dark:text-white">Latest from Mpumudde</h2></div><Link to="/newsroom/news" className="hidden items-center gap-2 text-sm font-black text-[var(--brand-green)] sm:flex">All stories <ArrowRight size={16} /></Link></div><div className="mt-8 grid gap-6 lg:grid-cols-3">{latest.slice(0, 3).map((item) => <NewsroomCard key={item.id} item={item} />)}</div></section>

          <section className="bg-slate-100/75 py-14 dark:bg-white/[.025]"><div className="site-container grid gap-10 lg:grid-cols-2">
            <div><div className="flex items-center justify-between"><h2 className="flex items-center gap-3 text-2xl font-black text-slate-950 dark:text-white"><Bell className="text-amber-600" />Announcements</h2><Link to="/newsroom/announcements" className="text-sm font-black text-[var(--brand-green)]">View all</Link></div><div className="mt-6 space-y-4">{announcements.map((item) => <Link key={item.id} to={`/newsroom/articles/${item.slug}`} className="block rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/5"><p className="text-xs font-black uppercase text-amber-700 dark:text-amber-300">{item.priority} notice</p><h3 className="mt-2 text-lg font-black text-slate-950 dark:text-white">{item.title}</h3><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.excerpt}</p></Link>)}</div></div>
            <div><div className="flex items-center justify-between"><h2 className="flex items-center gap-3 text-2xl font-black text-slate-950 dark:text-white"><CalendarDays className="text-cyan-700" />School events</h2><Link to="/newsroom/events" className="text-sm font-black text-[var(--brand-green)]">View all</Link></div><div className="mt-6 space-y-4">{events.map((item) => <Link key={item.id} to={`/newsroom/articles/${item.slug}`} className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:grid-cols-[6rem_1fr] dark:border-white/10 dark:bg-white/5"><div className="rounded-xl bg-cyan-50 p-3 text-center text-cyan-900 dark:bg-cyan-400/10 dark:text-cyan-200"><CalendarDays className="mx-auto" size={20} /><span className="mt-2 block text-xs font-black">{item.eventDate}</span></div><div><h3 className="text-lg font-black text-slate-950 dark:text-white">{item.title}</h3><p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.eventTime} · {item.eventLocation}</p></div></Link>)}</div></div>
          </div></section>

          <section className="site-container py-14"><div className="grid gap-5 md:grid-cols-3">{[["Academic stories", "Ideas, learning and classroom discovery.", "/newsroom/academics"], ["Student life", "Leadership, activities and everyday school experiences.", "/newsroom/student-life"], ["Sports & achievement", "Teams, participation, progress and recognition.", "/newsroom/sports"]].map(([title, text, to]) => <Link key={to} to={to} className="public-content-card"><h2 className="text-xl font-black text-slate-950 dark:text-white">{title}</h2><p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">{text}</p><span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-[var(--brand-green)]">Explore <ArrowRight size={16} /></span></Link>)}</div></section>

          <section className="bg-[var(--brand-ink)] py-14 text-white"><div className="site-container flex flex-col gap-7 md:flex-row md:items-center md:justify-between"><div><p className="text-xs font-black uppercase tracking-[.2em] text-emerald-300">Newsroom archive</p><h2 className="mt-3 text-3xl font-black">Looking for a particular story?</h2><p className="mt-3 text-slate-300">Search headlines, topics, authors and publication dates.</p></div><Link to="/newsroom/search" className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-6 py-3 font-black text-[var(--brand-ink)]"><Search size={18} />Search the archive</Link></div></section>
        </>}
      </main>
    </NewsroomShell>
  );
}
