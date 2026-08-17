import api from "../api/axios";

export type DirectorNotification = {
  id: string;
  type: string;
  title: string;
  message: string;
  link?: string | null;
  isRead: boolean;
  createdAt: string;
};

class NotificationService {
  async list(): Promise<DirectorNotification[]> {
    const { data } = await api.get<DirectorNotification[]>("/notifications");
    return data;
  }

  async markRead(id: string): Promise<DirectorNotification> {
    const { data } = await api.patch<DirectorNotification>(`/notifications/${id}/read`);
    return data;
  }
}

export default new NotificationService();
