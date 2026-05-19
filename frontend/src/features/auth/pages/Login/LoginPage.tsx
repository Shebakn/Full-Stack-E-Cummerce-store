import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, Button, Spinner } from "react-bootstrap";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Link, Navigate } from "react-router-dom";

import { useAuth } from "../../hooks/auth.hook";
import { useAuthUser } from "../../hooks/auth-user";
import "./styles.css";
import toast from "react-hot-toast";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Min 6 characters"),
});

type FormData = z.infer<typeof schema>;

const LoginPage = () => {

  const { isAuthenticated } = useAuthUser();
  
  const { handleLogin, isLoggingIn, isLoginError, loginError, isLoginSuccess } = useAuth();

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });


  useEffect(() => {
  if (isLoginError) {
    toast.error(loginError?.message || "Login failed");
  }
}, [loginError]);

useEffect(() => {
  if (isLoginSuccess) {
    toast.success("Login successful");
  }
}, [isLoginSuccess]);

  if (isAuthenticated) {
  return <Navigate to="/" replace />;
}

  /* ================= IMPORTANT FIX ================= */
  const onSubmit = (data: FormData) => {
    handleLogin(data);
  };

  return (
    <div className="register-container">
      <div className="register-card">

        <h2 className="register-title">Login</h2>

        <Form onSubmit={handleSubmit(onSubmit)}>

          {/* EMAIL */}
          <Form.Control
            placeholder="Email"
            className="custom-input"
            {...register("email")}
          />
          {errors.email && (
            <small className="text-danger">{errors.email.message}</small>
          )}

          {/* PASSWORD */}
          <div className="password-wrapper mt-3">
            <Form.Control
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="custom-input"
              {...register("password")}
            />

            <span
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>

          {errors.password && (
            <small className="text-danger">{errors.password.message}</small>
          )}

          {/* BUTTON */}
          <Button
            type="submit"
            className="btn-register w-100 mt-4"
            disabled={isLoggingIn}
          >
            {isLoggingIn ? <Spinner size="sm" /> : "Login"}
          </Button>
        </Form>

        <p className="text-center mt-3">
          Don’t have account? <Link to="/register">Register</Link>
        </p>

      </div>
    </div>
  );
};

export default LoginPage;