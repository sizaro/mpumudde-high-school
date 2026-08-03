import api from '../api/axios';

export type ParentListItem = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
};

export type LinkParentDto = {
  parentId: string;
  relationship?: string;
  isPrimary?: boolean;
};

class DirectorService {
  async getParents(): Promise<ParentListItem[]> {
    const { data } = await api.get<ParentListItem[]>('/parents');
    return data;
  }

  async linkParent(studentId: string, payload: LinkParentDto) {
    const { data } = await api.post(`/students/${studentId}/link-parent`, payload);
    return data;
  }
}

export default new DirectorService();