// api/client.ts
import axios from "axios";
import { getToken, removeToken } from "@/common/utils/auth-token";

const api = axios.create({
  baseURL: "http://localhost:3000/api/v1",
  timeout: 10000,
});

/* ================= REQUEST ================= */
api.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/* ================= RESPONSE ================= */
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401) {
      removeToken();

      // منع loop
      // setTimeout(() => {
      //   window.location.href = "/login";
      // }, 50);
    }

    return Promise.reject(error);
  }
);

export default api;