import { useQuery } from "@tanstack/react-query";
import { getProfile } from "../services/auth.service";
import { getToken, removeToken } from "@/common/utils/auth-token";
import type { User } from "../../../common/interfaces/user.interface";

export const AUTH_QUERY_KEY = ["auth-user"];

export const useAuthUser = () => {
  const token = getToken();

  const query = useQuery({
    queryKey: AUTH_QUERY_KEY,

    queryFn: async () => {
      const res = await getProfile();
      return res.data;
    },

    enabled: !!token, // 🔥 يشتغل فقط إذا فيه token

    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,

    retry: false,

    // 🔥 مهم جدًا
    onError: () => {
      console.log("Invalid token, logging out...");
    },
  });
;
  const user = query.data;

  return {
    ...query,

    user,

    isAuthenticated: !!user,

    // 🔥 roles مباشرة
    role: user?.role,
    isAdmin: user?.role === "ADMIN",
    isUser: user?.role === "USER",
  };
};