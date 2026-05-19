import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login, register } from "../services/auth.service";
import { setToken, removeToken } from "@/common/utils/auth-token";

export const AUTH_QUERY_KEY = ["auth-user"];

export const useAuth = () => {
  const queryClient = useQueryClient();

  /* ================= LOGIN ================= */
  const loginMutation = useMutation({
    mutationFn: login,

    onSuccess: (res: any) => {
      const user = res.data.user;
      const token = res.data.accessToken || res.data.token;

      setToken(token);
      queryClient.setQueryData(AUTH_QUERY_KEY, user);
    },
  });

  /* ================= REGISTER ================= */
  const registerMutation = useMutation({
    mutationFn: register,

    onSuccess: (res: any) => {
      const user = res.data.user;
      const token = res.data.accessToken || res.data.token;

      setToken(token);
      queryClient.setQueryData(AUTH_QUERY_KEY, user);
    },
  });

  /* ================= LOGOUT ================= */
  const logout = () => {
    removeToken();

    queryClient.removeQueries({
      queryKey: AUTH_QUERY_KEY,
    });
  };

  return {
    /* 🔐 LOGIN */
    handleLogin: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    isLoginSuccess: loginMutation.isSuccess,
    isLoginError: loginMutation.isError,
    loginError: loginMutation.error,

    /* 🆕 REGISTER */
    handleRegister: registerMutation.mutate,
    isRegistering: registerMutation.isPending,
    isRegisterSuccess: registerMutation.isSuccess,
    isRegisterError: registerMutation.isError,
    registerError: registerMutation.error,

    /* 🚪 LOGOUT */
    logout,
  };
};