// features/auth/hooks/useAuth.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login, register, getProfile } from "../services/auth.service";
import { useAuthStore } from "../store/auth.store";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    setAuth,
    logout: clearStore,
    user,
    token,
  } = useAuthStore();

  // ================= LOGIN =================
  const loginMutation = useMutation({
    mutationFn: login,

    onSuccess: (res) => {
  console.log("LOGIN RESPONSE", res.data);

    const {
      user,
      accessToken,
    } = res.data.data;

    console.log("TOKEN =", accessToken);

    setAuth(user, accessToken);

    navigate("/");
  },
  });

  // ================= REGISTER =================
  const registerMutation = useMutation({
    mutationFn: register,

    onSuccess: (res) => {
      const { user, token } = res.data.data;

      setAuth(user, token);

      navigate("/");
    },
  });

  // ================= GET ME =================
  const getMe = async () => {
    const res = await getProfile();
    console.log("From getMe")

    if (token) {
      setAuth(res.data.data, token);
    }

    return res.data.data;
  };

  // ================= LOGOUT =================
  const logout = () => {
    clearStore();

    queryClient.clear();

    navigate("/login");
  };

  // ================= AUTH =================
  const isAuthenticated =
  !!user && !!token;

  // ================= ROLE =================
  const role = user?.role;

  return {
    // Actions
    handleLogin: loginMutation.mutate,
    handleRegister: registerMutation.mutate,
    logout,
    getMe,

    // Status
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,

    // Auth
    user,
    token,
    isAuthenticated,

    // Role
    role,
    isAdmin: role === "ADMIN",
    isUser: role === "USER",
  };
};