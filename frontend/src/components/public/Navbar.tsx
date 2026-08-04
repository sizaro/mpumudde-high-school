import { useEffect, useState } from "react";
import { CalendarDays, ChevronDown, Mail, Menu, Moon, PhoneCall, Sun, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, NavLink, useLocation } from "react-router-dom";
import { publicNavigation } from "../../config/publicNavigation";
import { useTheme } from "../../context/ThemeContext";
import LoginModal from "../auth/LoginModal";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `public-nav-link ${isActive ? "public-nav-link--active" : ""}`;

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [newsroomOpen, setNewsroomOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
    setNewsroomOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setMobileOpen(false); };
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [mobileOpen]);

  return (
    <header className="public-header">
      <div className="hidden border-b border-white/10 bg-[var(--brand-ink)] text-white md:block">
        <div className="site-container flex h-10 items-center justify-between text-xs">
          <p className="inline-flex items-center gap-2 text-white/75"><CalendarDays size={14} className="text-[var(--brand-gold)]" />Admissions open for the 2026 intake</p>
          <div className="flex items-center gap-5 text-white/75">
            <a href="tel:+256312345678" className="inline-flex items-center gap-2 hover:text-white"><PhoneCall size={13} />+256 312 345 678</a>
            <a href="mailto:info@mpumuddehs.ac.ug" className="inline-flex items-center gap-2 hover:text-white"><Mail size={13} />info@mpumuddehs.ac.ug</a>
          </div>
        </div>
      </div>

      <div className="border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-[rgba(8,26,43,.94)]">
        <div className="site-container flex h-[4.5rem] items-center justify-between gap-5">
          <Link to="/" className="flex min-w-0 items-center gap-3" aria-label="Mpumudde High School home">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--brand-green)] text-xs font-black tracking-tight text-white shadow-lg shadow-emerald-900/15">MHS</span>
            <span className="min-w-0 leading-tight">
              <span className="block truncate text-base font-extrabold text-[var(--brand-ink)] dark:text-white sm:text-lg">Mpumudde High School</span>
              <span className="hidden text-[.65rem] font-bold uppercase tracking-[.18em] text-[var(--brand-green)] sm:block">Excellence · Discipline · Service</span>
            </span>
          </Link>

          <nav aria-label="Main navigation" className="hidden items-center gap-5 xl:flex">
            {publicNavigation.map((item) => item.children ? (
              <div key={item.to} className="relative" onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setNewsroomOpen(false); }}>
                <div className="flex items-center">
                  <NavLink to={item.to} onClick={() => setNewsroomOpen(false)} className={navLinkClass}>{item.label}</NavLink>
                  <button type="button" onClick={() => setNewsroomOpen((value) => !value)} className="ml-1 rounded-lg p-1 text-slate-500 hover:bg-slate-100 dark:text-white/65 dark:hover:bg-white/10" aria-label="Toggle Newsroom menu" aria-expanded={newsroomOpen}><ChevronDown size={15} className={`transition-transform ${newsroomOpen ? "rotate-180" : ""}`} /></button>
                </div>
                {newsroomOpen && <div className="absolute left-0 top-full z-20 mt-3 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl dark:border-white/10 dark:bg-[var(--brand-ink)]">{item.children.map((child) => <NavLink key={child.to} to={child.to} onClick={() => setNewsroomOpen(false)} className={({ isActive }) => `block rounded-xl px-4 py-2.5 text-sm font-semibold ${isActive ? "bg-emerald-50 text-[var(--brand-green)] dark:bg-white/10" : "text-slate-700 hover:bg-slate-50 dark:text-white/75 dark:hover:bg-white/5"}`}>{child.label}</NavLink>)}</div>}
              </div>
            ) : <NavLink key={item.to} to={item.to} end={item.end} className={navLinkClass}>{item.label}</NavLink>)}
          </nav>

          <div className="hidden items-center gap-2 xl:flex">
            <button type="button" onClick={toggleTheme} className="public-icon-button" aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}>{theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}</button>
            <button type="button" onClick={() => setLoginOpen(true)} className="public-primary-button">Portal Login</button>
          </div>

          <button type="button" className="public-icon-button xl:hidden" onClick={() => setMobileOpen(true)} aria-label="Open navigation" aria-expanded={mobileOpen}><Menu size={22} /></button>
        </div>
      </div>

      <AnimatePresence>
      {mobileOpen && <div className="fixed inset-0 z-[60] xl:hidden">
        <motion.button type="button" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .22 }} className="absolute inset-0 bg-slate-950/55 backdrop-blur-sm" onClick={() => setMobileOpen(false)} aria-label="Close navigation overlay" />
        <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "tween", duration: .3, ease: [0.22, 1, 0.36, 1] }} role="dialog" aria-modal="true" aria-label="Mobile navigation" className="absolute right-0 top-0 h-full w-[min(88vw,24rem)] overflow-y-auto bg-white p-5 shadow-2xl dark:bg-[var(--brand-ink)]">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4 dark:border-white/10"><span className="font-bold text-[var(--brand-ink)] dark:text-white">Navigation</span><button type="button" onClick={() => setMobileOpen(false)} className="public-icon-button" aria-label="Close navigation"><X size={20} /></button></div>
          <nav className="mt-5 space-y-1" aria-label="Mobile navigation">
            {publicNavigation.map((item) => <div key={item.to}>
              <div className="flex items-center">
                <NavLink to={item.to} end={item.end} className={({ isActive }) => `min-w-0 flex-1 rounded-xl px-4 py-3 text-sm font-semibold ${isActive ? "bg-emerald-50 text-[var(--brand-green)] dark:bg-white/10" : "text-slate-700 dark:text-white/80"}`}>{item.label}</NavLink>
                {item.children && <button type="button" onClick={() => setNewsroomOpen((value) => !value)} className="ml-1 rounded-lg p-3 text-slate-500 dark:text-white/65" aria-label="Toggle Newsroom links" aria-expanded={newsroomOpen}><ChevronDown size={17} className={`transition-transform ${newsroomOpen ? "rotate-180" : ""}`} /></button>}
              </div>
              {item.children && newsroomOpen && <div className="ml-4 border-l border-slate-200 pl-3 dark:border-white/10">{item.children.map((child) => <NavLink key={child.to} to={child.to} className={({ isActive }) => `block rounded-lg px-3 py-2 text-sm ${isActive ? "font-semibold text-[var(--brand-green)]" : "text-slate-600 dark:text-white/65"}`}>{child.label}</NavLink>)}</div>}
            </div>)}
          </nav>
          <div className="mt-6 grid gap-3 border-t border-slate-200 pt-5 dark:border-white/10"><button type="button" onClick={toggleTheme} className="public-secondary-button justify-between">{theme === "dark" ? "Use light mode" : "Use dark mode"}{theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}</button><button type="button" onClick={() => { setMobileOpen(false); setLoginOpen(true); }} className="public-primary-button justify-center">Portal Login</button></div>
        </motion.div>
      </div>}
      </AnimatePresence>

      {loginOpen && <LoginModal onClose={() => setLoginOpen(false)} />}
    </header>
  );
}
