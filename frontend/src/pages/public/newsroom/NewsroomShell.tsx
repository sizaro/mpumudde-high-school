import { Search } from "lucide-react";
import { type FormEvent, type ReactNode, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

const links = [
  ["Highlights", "/newsroom"], ["Latest", "/newsroom/news"], ["Announcements", "/newsroom/announcements"], ["Events", "/newsroom/events"],
  ["Academics", "/newsroom/academics"], ["Student Life", "/newsroom/student-life"], ["Sports", "/newsroom/sports"], ["Achievements", "/newsroom/achievements"], ["Media", "/newsroom/media"],
];

export default function NewsroomShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate(); const [search, setSearch] = useState("");
  const submit = (event: FormEvent) => { event.preventDefault(); if (search.trim()) navigate(`/newsroom/search?q=${encodeURIComponent(search.trim())}`); };
  return (
    <div className="min-h-screen bg-white dark:bg-[#050d16]">
      <header className="border-b border-slate-200 bg-[var(--brand-ink)] text-white dark:border-white/10">
        <div className="site-container flex flex-col gap-5 py-7 lg:flex-row lg:items-center lg:justify-between">
          <div><Link to="/newsroom" className="text-2xl font-black tracking-tight sm:text-3xl">Mpumudde Newsroom</Link><p className="mt-1 text-sm text-slate-300">Stories, notices and moments from our school community</p></div>
          <form onSubmit={submit} className="flex w-full max-w-md overflow-hidden rounded-full border border-white/15 bg-white/10">
            <label htmlFor="newsroom-search" className="sr-only">Search the Newsroom</label><input id="newsroom-search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search stories and notices" className="min-w-0 flex-1 bg-transparent px-5 py-3 text-sm text-white outline-none placeholder:text-slate-400" /><button type="submit" className="px-4 text-emerald-300" aria-label="Search"><Search size={19} /></button>
          </form>
        </div>
        <nav aria-label="Newsroom categories" className="border-t border-white/10">
          <div className="site-container flex gap-1 overflow-x-auto py-2 [scrollbar-width:none]">
            {links.map(([label, to]) => <NavLink key={to} to={to} end={to === "/newsroom"} className={({ isActive }) => `shrink-0 rounded-full px-4 py-2 text-sm font-bold ${isActive ? "bg-white text-[var(--brand-ink)]" : "text-slate-300 hover:bg-white/10 hover:text-white"}`}>{label}</NavLink>)}
          </div>
        </nav>
      </header>
      {children}
      <section className="border-t border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/[.025]">
        <div className="site-container grid gap-8 py-12 md:grid-cols-3">
          <div><h2 className="font-black text-slate-900 dark:text-white">Mpumudde Newsroom</h2><p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">Official school stories, announcements, events and community updates.</p></div>
          <div><h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">Contribute a story</h3><p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">Students, staff and families can share a story idea with the school administration.</p><Link to="/contact" className="mt-3 inline-block text-sm font-bold text-[var(--brand-green)]">Contact the school</Link></div>
          <div><h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">Explore</h3><div className="mt-3 flex flex-wrap gap-3 text-sm font-bold text-[var(--brand-green)]"><Link to="/newsroom/search">Search archive</Link><Link to="/newsroom/announcements">Announcements</Link><Link to="/newsroom/events">Events</Link></div></div>
        </div>
      </section>
    </div>
  );
}
