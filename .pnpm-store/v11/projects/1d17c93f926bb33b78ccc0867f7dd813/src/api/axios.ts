
import axios from "axios";

export const AUTH_EXPIRED_EVENT = "mpumudde:auth-expired";

const api = axios.create({

  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",

  headers: {

    "Content-Type": "application/json",

  },

  withCredentials: true,

});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401 && typeof window !== "undefined") {
      window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
    }
    return Promise.reject(error);
  },
);

export default api;
