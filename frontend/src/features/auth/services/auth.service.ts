import api from "@/api/client";
import type { User } from "@/common/interfaces/user.interface";

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  data: {
    user: User;
    token?: string;
    accessToken?: string;
  };
}

/* ================= ERROR HANDLER ================= */
const handleApiError = (error: any) => {
  const message =
    error?.response?.data?.error?.message ||
    error?.response?.data?.message ||
    error?.message ||
    "Something went wrong";

  const details = error?.response?.data?.error?.details;

  const err = { message, details };

  throw err;
};

/* ================= LOGIN ================= */
export const login = async (data: LoginData): Promise<AuthResponse> => {
  try {
    const res = await api.post("/auth/login", data);
    return res.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/* ================= REGISTER ================= */
export const register = async (data: RegisterData): Promise<AuthResponse> => {
  try {
    const res = await api.post("/auth/register", data);
    return res.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/* ================= PROFILE ================= */
export const getProfile = async () => {
  try {
    const res = await api.get("/profile/me");
    console.log("Auth me: ", res.data)
    return res.data;
  } catch (error) {
    throw handleApiError(error);
  }
};