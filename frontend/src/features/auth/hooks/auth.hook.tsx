import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "../services/auth.service";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { setToken, removeToken } from "@/common/utils/auth-token";

export const AUTH_QUERY_KEY = ["auth-user"];

export const useAuth = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: login,

    onSuccess: (res: any) => {
      const user = res.data.user;
      const token = res.data.accessToken || res.data.token;

      // 🔥 خزّن التوكن فقط
      setToken(token);

      // 🔥 خزّن user في cache
      queryClient.setQueryData(AUTH_QUERY_KEY, user);

      toast.success("Welcome back 👋");

      navigate("/", { replace: true });
    },

    onError: (err: any) => {
      const msg = err?.message || "Login failed";

      if (err?.details) {
        Object.values(err.details).forEach((m: any) => {
          toast.error(m);
        });
      } else {
        toast.error(msg);
      }
    },
  });

  const logout = () => {
    removeToken();

    queryClient.removeQueries({
      queryKey: AUTH_QUERY_KEY,
    });

    // navigate("/login");
  };

  return {
    handleLogin: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    logout,
  };
};