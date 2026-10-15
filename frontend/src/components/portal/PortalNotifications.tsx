import { Bell, Inbox } from "lucide-react";
import { createPortal } from "react-dom";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import NotificationService, {
  type PortalNotification,
} from "../../services/notificationService";

type PanelPosition = { top: number; left: number; width: number };

/** Read-only delivery inbox used by every portal with a User account. */
export default function PortalNotifications({
  label = "Notifications",
  messagesPath,
}: {
  label?: string;
  messagesPath?: string;
}) {
  const navigate = useNavigate();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<PortalNotification[]>([]);
  const [position, setPosition] = useState<PanelPosition | null>(null);

  useEffect(() => {
    const load = () =>
      NotificationService.list()
        .then(setItems)
        .catch(() => undefined);
    void load();
    const interval = window.setInterval(load, 60_000);
    return () => window.clearInterval(interval);
  }, []);

  useLayoutEffect(() => {
    if (!open) return;

    const placePanel = () => {
      const rect = buttonRef.current?.getBoundingClientRect();
      if (!rect) return;
      const width = Math.min(window.innerWidth - 24, 384);
      setPosition({
        top: Math.min(rect.bottom + 8, window.innerHeight - 16),
        left: Math.max(
          12,
          Math.min(rect.right - width, window.innerWidth - width - 12),
        ),
        width,
      });
    };

    placePanel();
    window.addEventListener("resize", placePanel);
    window.addEventListener("scroll", placePanel, true);
    return () => {
      window.removeEventListener("resize", placePanel);
      window.removeEventListener("scroll", placePanel, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const closeOnOutsidePress = (event: PointerEvent) => {
      const target = event.target as Node;
      if (
        !buttonRef.current?.contains(target) &&
        !panelRef.current?.contains(target)
      ) {
        setOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", closeOnOutsidePress);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePress);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  const openItem = async (item: PortalNotification) => {
    if (!item.isRead) {
      await NotificationService.markRead(item.id).catch(() => undefined);
      setItems((current) =>
        current.map((entry) =>
          entry.id === item.id ? { ...entry, isRead: true } : entry,
        ),
      );
    }

    setOpen(false);
    const legacyCommunicationPath =
      item.entityType === "SchoolCommunication" && item.entityId && messagesPath
        ? `${messagesPath}/${item.entityId}`
        : undefined;
    const destination = item.link || legacyCommunicationPath;
    if (destination) navigate(destination);
  };

  const unread = items.filter((item) => !item.isRead).length;
  const panel =
    open && position
      ? createPortal(
          <div
            ref={panelRef}
            className="fixed z-[1000] max-h-[min(30rem,calc(100vh-1rem))] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl"
            style={{
              top: position.top,
              left: position.left,
              width: position.width,
            }}
            role="dialog"
            aria-label={label}
          >
            <p className="px-3 py-2 text-sm font-semibold text-slate-800">
              {label}
            </p>
            {items.length ? (
              items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => void openItem(item)}
                  className={`w-full rounded-xl p-3 text-left transition hover:bg-slate-50 ${item.isRead ? "text-slate-500" : "bg-blue-50 text-slate-900"}`}
                >
                  <p className="text-sm font-semibold">{item.title}</p>
                  <p className="mt-1 line-clamp-3 text-xs leading-5">
                    {item.message}
                  </p>
                  <p className="mt-2 text-[11px] text-slate-400">
                    {new Date(item.createdAt).toLocaleString()}
                  </p>
                </button>
              ))
            ) : (
              <p className="p-4 text-sm text-slate-500">
                No notifications yet.
              </p>
            )}
            {messagesPath && (
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  navigate(messagesPath);
                }}
                className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <Inbox size={16} /> View all school messages
              </button>
            )}
          </div>,
          document.body,
        )
      : null;

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        aria-label={label}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <Bell size={19} />
        {unread > 0 && (
          <span className="absolute right-0.5 top-0.5 min-w-5 rounded-full bg-red-600 px-1 text-center text-[10px] font-bold leading-5 text-white">
            {unread > 99 ? "99+" : unread}
          </span>
        )}
      </button>
      {panel}
    </div>
  );
}
