// features/auth/pages/LoginPage.tsx

import { useForm } from "react-hook-form";
import { useAuth } from "../hooks/auth.hook"; 

type LoginForm = {
  email: string;
  password: string;
};

export const LoginPage = () => {
  const {
    handleLogin,
    isLoggingIn,
    isAuthenticated,
  } = useAuth();

  const {
    register,
    handleSubmit,
  } = useForm<LoginForm>();

  const onSubmit = (data: LoginForm) => {
    handleLogin(data); // React Query mutation
  };

  // 🔥 redirect تلقائي بعد login
  if (isAuthenticated) {
    window.location.href = "/";
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h1>Login</h1>

      <input placeholder="Email" {...register("email")} />
      <input
        placeholder="Password"
        type="password"
        {...register("password")}
      />

      <button type="submit" disabled={isLoggingIn}>
        {isLoggingIn ? "Loading..." : "Login"}
      </button>
    </form>
  );
};