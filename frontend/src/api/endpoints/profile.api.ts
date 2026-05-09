import api from "@/api/client";

/* ================= GET PROFILE ================= */

export const getProfile = async () => {
  const { data } = await api.get(
    "/auth/profile"
  );

  return data;
};