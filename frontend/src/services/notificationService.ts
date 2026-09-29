import api from "../api/axios";

export type PortalNotification = {
  id: string;
  type: string;
  title: string;
  message: string;
  link?: string | null;
  isRead: boolean;
  createdAt: string;
};

// Kept as an alias while the Director layout is gradually shared with the
// teacher and parent portals.
export type DirectorNotification = PortalNotification;

class NotificationService {
  async list(): Promise<PortalNotification[]> {
    const { data } = await api.get<PortalNotification[]>("/notifications");
    return data;
  }

  async markRead(id: string): Promise<PortalNotification[]> {
    const { data } = await api.patch<PortalNotification[]>(`/notifications/${id}/read`);
    return data;
  }
}

export default new NotificationService();
