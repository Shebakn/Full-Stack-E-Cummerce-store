import { useMutation } from "@tanstack/react-query";
import { login } from "../services/auth.service";
import { useAuthStore } from "../store/auth.store";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export const useAuth = () => {
  const navigate = useNavigate();

  const { setAuth, logout } = useAuthStore();

  /* ================= LOGIN ================= */
  const loginMutation = useMutation({
    mutationFn: login,

    onSuccess: (res: any) => {
      const user = res.data.user;
      const token = res.data.accessToken || res.data.token;

      setAuth(user, token);

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

  return {
    handleLogin: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    logout,
  };
};