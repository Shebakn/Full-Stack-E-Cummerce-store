import { useForm } from "react-hook-form";
import { useAuthStore } from "@/store/auth.store";
import { useNavigate } from "react-router-dom";

type RegisterForm = {
  name: string;
  email: string;
  password: string;
};

export const RegisterPage = () => {
  const registerUser = useAuthStore((s) => s.register);
  const isLoading = useAuthStore((s) => s.isLoading);
  const error = useAuthStore((s) => s.error);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
  } = useForm<RegisterForm>();

  const onSubmit = async (data: RegisterForm) => {
    await registerUser(data);

    const state = useAuthStore.getState();

    if (state.isAuthenticated) {
      navigate("/");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h1>Register</h1>

      <input placeholder="Name" {...register("name")} />
      <input placeholder="Email" {...register("email")} />
      <input placeholder="Password" type="password" {...register("password")} />

      <button type="submit" disabled={isLoading}>
        {isLoading ? "Loading..." : "Register"}
      </button>

      {error && <p>{error}</p>}
    </form>
  );
};