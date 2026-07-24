import { useState } from "react";
import { CalendarDays, Mail, Menu, Moon, PhoneCall, Sun, X, ChevronDown } from "lucide-react";
import { Link, NavLink, useLocation } from "react-router-dom";
import LoginModal from "../auth/LoginModal";
import { useTheme } from "../../context/ThemeContext";

const navLinks = [
  { label: "Home", to: "/", end: true },
  { label: "About", to: "/about" },
  { label: "Academics", to: "/academics" },
  { label: "Admissions", to: "/admissions" },
  { 
    label: "Newsroom", 
    to: "/newsroom",
    dropdown: [
      { label: "News", to: "/newsroom/news" },
      { label: "Events", to: "/newsroom/events" },
      { label: "Announcements", to: "/newsroom/announcements" },
      { label: "School Updates", to: "/newsroom/updates" },
      { label: "Media Gallery", to: "/newsroom/media" },
    ]
  },
  { label: "Gallery", to: "/gallery" },
  { label: "Contact", to: "/contact" },
];

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `text-sm font-semibold tracking-wide transition-all duration-300 ${
    isActive 
      ? "text-emerald-400 dark:text-emerald-300" 
      : "text-slate-700 dark:text-white/80 hover:text-emerald-500 dark:hover:text-emerald-200"
  }`;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [newsroomOpen, setNewsroomOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  return (
    <nav className="fixed inset-x-0 top-0 z-50">
      {/* Top info bar with glass effect */}
      <div className="border-b border-slate-200/50 dark:border-white/10 transition-colors" style={{ 
        background: theme === 'dark' ? 'rgba(5, 8, 15, 0.7)' : 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(20px) saturate(180%)'
      }}>
        <div className="site-container flex flex-wrap items-center justify-center gap-x-6 gap-y-2 py-2 text-xs sm:justify-between">
          <p className="inline-flex items-center gap-2 text-slate-600 dark:text-white/70">
            <CalendarDays size={14} className="text-emerald-500 dark:text-emerald-400" />
            Admissions open for 2026 intake
          </p>
          <div className="flex items-center gap-5 text-slate-600 dark:text-white/70">
            <span className="inline-flex items-center gap-2">
              <PhoneCall size={13} className="text-emerald-500 dark:text-emerald-400" />
              +256 312 345 678
            </span>
            <span className="inline-flex items-center gap-2">
              <Mail size={13} className="text-emerald-500 dark:text-emerald-400" />
              info@mpumuddehs.ac.ug
            </span>
          </div>
        </div>
      </div>

      {/* Main navbar with stronger glass effect */}
      <div className="border-b border-slate-200/50 dark:border-white/10 transition-colors" style={{
        background: theme === 'dark' ? 'rgba(5, 8, 15, 0.8)' : 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(24px) saturate(200%)'
      }}>
        <div className="site-container flex items-center justify-between py-4">
          <Link
            to="/"
            className="flex items-center gap-3 transition-transform hover:scale-105"
            aria-label="Go to Mpumudde High School homepage"
          >
            <div className="glass-card-solid h-12 w-12 rounded-xl p-2">
              <img
                src="/logo.png"
                alt="Mpumudde High School logo"
                className="h-full w-full object-contain"
              />
            </div>
            <div className="leading-tight">
              <p className="text-base font-extrabold text-slate-900 dark:text-white sm:text-lg transition-colors">
                Mpumudde High School
              </p>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-300 transition-colors">
                Excellence • Discipline • Service
              </p>
            </div>
          </Link>

          <div className="hidden items-center gap-6 xl:flex">
            {navLinks.map((link) => (
              link.dropdown ? (
                <div 
                  key={link.to}
                  className="relative"
                  onMouseEnter={() => setNewsroomOpen(true)}
                  onMouseLeave={() => setNewsroomOpen(false)}
                >
                  <button
                    className={`inline-flex items-center gap-1 text-sm font-semibold tracking-wide transition-all duration-300 ${
                      location.pathname.startsWith('/newsroom')
                        ? "text-emerald-400 dark:text-emerald-300"
                        : "text-slate-700 dark:text-white/80 hover:text-emerald-500 dark:hover:text-emerald-200"
                    }`}
                  >
                    {link.label}
                    <ChevronDown size={16} className={`transition-transform ${newsroomOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {newsroomOpen && (
                    <div className="absolute top-full left-0 mt-2 w-56 glass-card-solid rounded-xl shadow-2xl overflow-hidden">
                      {link.dropdown.map((item) => (
                        <NavLink
                          key={item.to}
                          to={item.to}
                          className={({ isActive }) => `block px-5 py-3 text-sm font-semibold transition-all ${
                            isActive
                              ? "bg-emerald-400/20 text-emerald-400"
                              : "text-slate-700 dark:text-white/80 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-emerald-500 dark:hover:text-emerald-300"
                          }`}
                        >
                          {item.label}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <NavLink key={link.to} to={link.to} end={link.end} className={navLinkClass}>
                  {link.label}
                </NavLink>
              )
            ))}

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="glass-card rounded-xl p-2.5 transition-all hover:scale-110 hover:rotate-12"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? (
                <Sun size={18} className="text-amber-400" />
              ) : (
                <Moon size={18} className="text-indigo-600" />
              )}
            </button>

            <button
              onClick={() => setShowLogin(true)}
              className="glass-button text-sm"
            >
              Portal Login
            </button>
          </div>

          <button
            className="glass-card inline-flex rounded-xl p-2 text-slate-700 dark:text-white/90 xl:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
        </div>
      </div>

      {open && (
        <>
          <button
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-label="Close menu overlay"
          />

          <div className="glass-card-solid fixed right-0 top-0 h-screen w-[82vw] max-w-sm overflow-y-auto border-l border-slate-200/50 dark:border-white/10 p-5 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-600 dark:text-white/60">
                Navigation
              </p>
              <button
                onClick={() => setOpen(false)}
                className="glass-card rounded-lg p-2 text-slate-700 dark:text-white/90"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `block rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                      isActive
                        ? "glass-card-solid text-emerald-600 dark:text-emerald-300"
                        : "text-slate-700 dark:text-white/80 hover:bg-slate-200/50 dark:hover:bg-white/5"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>

            {/* Theme Toggle in Mobile Menu */}
            <div className="my-4 border-t border-slate-200/50 dark:border-white/10 pt-4">
              <button
                onClick={toggleTheme}
                className="glass-card w-full rounded-xl px-4 py-3 text-left text-sm font-semibold transition-all hover:bg-slate-200/50 dark:hover:bg-white/5 flex items-center justify-between"
              >
                <span className="text-slate-700 dark:text-white/80">
                  {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </span>
                {theme === 'dark' ? (
                  <Sun size={18} className="text-amber-400" />
                ) : (
                  <Moon size={18} className="text-indigo-600" />
                )}
              </button>
            </div>

            <button
              onClick={() => {
                setOpen(false);
                setShowLogin(true);
              }}
              className="glass-button mt-6 w-full text-sm"
            >
              Portal Login
            </button>
          </div>
        </>
      )}

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </nav>
  );
}