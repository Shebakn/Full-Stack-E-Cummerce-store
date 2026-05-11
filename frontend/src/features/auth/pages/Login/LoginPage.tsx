import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, Button, Spinner } from "react-bootstrap";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Link } from "react-router-dom";

import { useAuth } from "../../hooks/auth.hook";

import "./styles.css";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Min 6 characters"),
});

type FormData = z.infer<typeof schema>;

const LoginPage = () => {
  const { handleLogin, isLoggingIn } = useAuth();

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

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