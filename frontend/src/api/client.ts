
import axios from "axios";
import { useAuthStore } from "@/features/auth/store/auth.store";

const api = axios.create({
  baseURL: "http://localhost:3000/api/v1",
  timeout: 10000,
});

// ✅ إضافة التوكن
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 🔥 التعامل مع 401 هنا (مو في React Query)
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      const { logout } = useAuthStore.getState();

      logout();

      // إعادة توجيه (بدون hook)
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;