import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  BarChart3,
  Bell,
  BookOpenCheck,
  ChevronDown,
  ClipboardCheck,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareText,
  School,
  ShieldCheck,
  UserRoundCog,
  UsersRound,
  WalletCards,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import NotificationService, { type DirectorNotification } from "../../services/notificationService";

const navButton = ({ isActive }: { isActive: boolean }) =>
  `portal-nav-item ${isActive ? "portal-nav-item--active" : ""}`;

const subNavButton = ({ isActive }: { isActive: boolean }) =>
  `portal-subnav-item ${isActive ? "portal-nav-item--active" : ""}`;

export default function DirectorLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [studentsMenuOpen, setStudentsMenuOpen] = useState(false);
  const [teachersMenuOpen, setTeachersMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<DirectorNotification[]>([]);

  useEffect(() => {
    const load = () => NotificationService.list().then(setNotifications).catch(() => undefined);
    void load();
    const interval = window.setInterval(load, 60_000);
    return () => window.clearInterval(interval);
  }, []);

  const openNotification = async (item: DirectorNotification) => {
    if (!item.isRead) {
      await NotificationService.markRead(item.id);
      setNotifications((current) => current.map((entry) => entry.id === item.id ? { ...entry, isRead: true } : entry));
    }
    setNotificationsOpen(false);
    if (item.link) navigate(item.link);
  };

  return (
    <div className="portal-shell director-portal text-slate-900">
      <div className="flex min-h-screen flex-col lg:flex-row">
        {mobileNavOpen && (
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setMobileNavOpen(false)}
            className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
          />
        )}
        <aside
          className={`portal-sidebar fixed inset-y-0 left-0 z-50 w-72 overflow-y-auto p-6 transition-transform duration-300 lg:static lg:z-auto lg:min-h-screen lg:translate-x-0 ${mobileNavOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="sticky top-0 space-y-4">
            <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-5">
              <div className="flex items-center gap-3">
                <div className="portal-brand-mark"><School size={22} /></div>
                <div>
                  <h2 className="text-base font-bold tracking-tight text-white">Mpumudde High</h2>
                  <p className="mt-0.5 text-xs text-white/55">Director command centre</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMobileNavOpen(false)}
                className="rounded-xl p-2 text-white/70 hover:bg-white/10 hover:text-white lg:hidden"
                aria-label="Close navigation"
              >
                <X size={20} />
              </button>
            </div>

            <nav
              className="mt-6 space-y-2 text-sm"
              onClick={(event) => {
                if ((event.target as HTMLElement).closest("a")) {
                  setMobileNavOpen(false);
                }
              }}
            >
              <NavLink to="." className={navButton} end>
                <LayoutDashboard size={18} /> Overview
              </NavLink>

              <div>
                <button
                  type="button"
                  onClick={() => setStudentsMenuOpen(!studentsMenuOpen)}
                  className={`${navButton({ isActive: studentsMenuOpen })} flex items-center justify-between w-full`}
                >
                  <span className="flex items-center gap-3"><GraduationCap size={18} /> Students</span>
                  <ChevronDown
                    size={16}
                    className={`transition ${studentsMenuOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {studentsMenuOpen && (
                  <div className="mt-1 space-y-1">
                    <NavLink
                      to="students/register"
                      className={subNavButton}
                      end
                    >
                      Register Student
                    </NavLink>
                    <NavLink to="students" className={subNavButton} end>
                      Registered Students
                    </NavLink>
                    <NavLink to="students/status" className={subNavButton} end>
                      Student Status
                    </NavLink>
                    <NavLink to="students/promotion" className={subNavButton} end>
                      Promotion & Movement
                    </NavLink>
                  </div>
                )}
              </div>

              <NavLink to="guardians" className={navButton}>
                <UserRoundCog size={18} /> Guardians
              </NavLink>

              <NavLink to="finance" className={navButton} end>
                <WalletCards size={18} /> Finances
              </NavLink>

              <div>
                <button
                  type="button"
                  onClick={() => setTeachersMenuOpen(!teachersMenuOpen)}
                  className={`${navButton({ isActive: teachersMenuOpen })} flex items-center justify-between w-full`}
                >
                  <span className="flex items-center gap-3"><UsersRound size={18} /> Teachers</span>
                  <ChevronDown
                    size={16}
                    className={`transition ${teachersMenuOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {teachersMenuOpen && (
                  <div className="mt-1 space-y-1">
                    <NavLink to="teachers" className={subNavButton} end>
                      All Teachers
                    </NavLink>
                    <NavLink to="teachers/create" className={subNavButton} end>
                      Register Teacher
                    </NavLink>
                  </div>
                )}
              </div>

              <NavLink to="account-management" className={navButton} end>
                <ShieldCheck size={18} /> Account Management
              </NavLink>
              <NavLink to="academic-setup" className={navButton} end>
                <BookOpenCheck size={18} /> Academic Setup
              </NavLink>
              <NavLink to="attendance" className={navButton} end>
                <ClipboardCheck size={18} /> Attendance
              </NavLink>
              <NavLink to="communications" className={navButton} end>
                <MessageSquareText size={18} /> Communication
              </NavLink>
              <NavLink to="reports" className={navButton} end>
                <BarChart3 size={18} /> Reports
              </NavLink>
            </nav>
          </div>
        </aside>

        <main className="portal-main min-w-0 flex-1 overflow-x-hidden p-3 sm:p-5 lg:p-8">
          <header className="portal-topbar mb-6 flex items-center justify-between rounded-3xl px-4 py-3 sm:px-5">
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200/80 bg-white/80 text-slate-700 shadow-sm lg:hidden"
              aria-label="Open navigation"
            >
              <Menu size={21} />
            </button>
            <div className="hidden lg:block">
              <p className="text-sm font-bold text-slate-800">School administration</p>
              <p className="text-xs text-slate-500">Director workspace</p>
            </div>
            <div className="ml-auto flex items-center gap-3">
              <div className="relative">
                <button type="button" onClick={() => setNotificationsOpen((value) => !value)} className="relative inline-flex h-12 w-12 items-center justify-center rounded-3xl border border-slate-200 bg-white text-slate-700 shadow-sm" aria-label="View notifications">
                  <Bell size={20} />
                  {notifications.some((item) => !item.isRead) && <span className="absolute right-1 top-1 min-w-5 rounded-full bg-red-600 px-1 text-center text-[10px] font-bold leading-5 text-white">{notifications.filter((item) => !item.isRead).length}</span>}
                </button>
                {notificationsOpen && <div className="absolute right-0 z-30 mt-2 max-h-96 w-[min(88vw,24rem)] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl"><div className="px-3 py-2 text-sm font-semibold">Director notifications</div>{notifications.length ? notifications.map((item) => <button key={item.id} type="button" onClick={() => void openNotification(item)} className={`w-full rounded-xl p-3 text-left hover:bg-slate-50 ${item.isRead ? "text-slate-500" : "bg-blue-50 text-slate-900"}`}><p className="text-sm font-semibold">{item.title}</p><p className="mt-1 text-xs">{item.message}</p><p className="mt-2 text-[11px] text-slate-400">{new Date(item.createdAt).toLocaleString()}</p></button>) : <p className="p-4 text-sm text-slate-500">No notifications yet.</p>}</div>}
              </div>
              <button
                type="button"
                onClick={logout}
                className="portal-action-button h-11"
              >
                <LogOut size={18} />
                Log out
              </button>
            </div>
          </header>

          <div className="portal-page portal-content animate-[fadeIn_0.4s_ease-out]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
