import api from "@/api/client";

/* ================= TYPES ================= */

type LoginDto = {
  email: string;
  password: string;
};

type RegisterDto = {
  name: string;
  email: string;
  password: string;
};

/* ================= LOGIN ================= */

export const loginApi = async (
  body: LoginDto
) => {
  const { data } = await api.post(
    "/auth/login",
    body
  );

  return data;
};

/* ================= REGISTER ================= */

export const registerApi = async (
  body: RegisterDto
) => {
  const { data } = await api.post(
    "/auth/register",
    body
  );

  return data;
};