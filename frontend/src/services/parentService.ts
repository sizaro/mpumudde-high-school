import api from "../api/axios";

class ParentService {
  async getMyFinance() {
    const { data } = await api.get("/parents/me/finance");
    return data;
  }
  async updateParent(id: string, payload: Record<string, unknown>) {
    const { data } = await api.patch(`/parents/${id}`, payload);
    return data;
  }
}

export default new ParentService();
