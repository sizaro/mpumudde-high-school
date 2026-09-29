import { Bell } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NotificationService, { type PortalNotification } from '../../services/notificationService';

/** Read-only delivery inbox used by every portal with a User account. */
export default function PortalNotifications({ label = 'Notifications' }: { label?: string }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<PortalNotification[]>([]);

  useEffect(() => {
    const load = () => NotificationService.list().then(setItems).catch(() => undefined);
    void load();
    const interval = window.setInterval(load, 60_000);
    return () => window.clearInterval(interval);
  }, []);

  const openItem = async (item: PortalNotification) => {
    if (!item.isRead) {
      await NotificationService.markRead(item.id).catch(() => undefined);
      setItems((current) => current.map((entry) => entry.id === item.id ? { ...entry, isRead: true } : entry));
    }
    setOpen(false);
    if (item.link) navigate(item.link);
  };

  const unread = items.filter((item) => !item.isRead).length;
  return <div className="relative">
    <button type="button" onClick={() => setOpen((value) => !value)} className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md" aria-label={label}>
      <Bell size={19} />
      {unread > 0 && <span className="absolute right-0.5 top-0.5 min-w-5 rounded-full bg-red-600 px-1 text-center text-[10px] font-bold leading-5 text-white">{unread > 99 ? '99+' : unread}</span>}
    </button>
    {open && <div className="absolute right-0 z-40 mt-2 max-h-96 w-[min(88vw,24rem)] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl">
      <p className="px-3 py-2 text-sm font-semibold text-slate-800">{label}</p>
      {items.length ? items.map((item) => <button key={item.id} type="button" onClick={() => void openItem(item)} className={`w-full rounded-xl p-3 text-left transition hover:bg-slate-50 ${item.isRead ? 'text-slate-500' : 'bg-blue-50 text-slate-900'}`}>
        <p className="text-sm font-semibold">{item.title}</p>
        <p className="mt-1 line-clamp-3 text-xs leading-5">{item.message}</p>
        <p className="mt-2 text-[11px] text-slate-400">{new Date(item.createdAt).toLocaleString()}</p>
      </button>) : <p className="p-4 text-sm text-slate-500">No notifications yet.</p>}
    </div>}
  </div>;
}
