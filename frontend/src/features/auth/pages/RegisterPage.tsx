import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, Button, Spinner } from "react-bootstrap";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { Link, Navigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../hooks/auth.hook";
import { useAuthUser } from "../hooks/auth-user";

import "./styles.css";

/* ================= VALIDATION ================= */
const schema = z.object({
  name: z.string().min(3, "Name too short"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Min 6 characters"),
});

type FormData = z.infer<typeof schema>;

const RegisterPage = () => {
  const { isAuthenticated } = useAuthUser();

  const {
    handleRegister,
    isRegistering,
    isRegisterSuccess,
    isRegisterError,
    registerError,
  } = useAuth();

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  /* ================= SUBMIT ================= */
  const onSubmit = (data: FormData) => {
    handleRegister(data);
  };

  /* ================= TOASTS ================= */
  useEffect(() => {
    if (isRegisterSuccess) {
      toast.success("Account created successfully");
    }
  }, [isRegisterSuccess]);

  useEffect(() => {
    if (isRegisterError) {
      if (registerError?.details) {
        Object.values(registerError.details).forEach((msg: any) => {
          toast.error(msg);
        });
      } else {
        toast.error(registerError?.message || "Register failed");
      }
    }
  }, [isRegisterError]);

  /* ================= REDIRECT ================= */
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="register-container">
      <div className="register-card">

        <h2 className="register-title">Create Account</h2>

        <Form onSubmit={handleSubmit(onSubmit)}>

          {/* NAME */}
          <Form.Control
            placeholder="Full Name"
            className="custom-input"
            {...register("name")}
          />
          {errors.name && (
            <small className="text-danger">{errors.name.message}</small>
          )}

          {/* EMAIL */}
          <Form.Control
            placeholder="Email"
            className="custom-input mt-3"
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
            disabled={isRegistering}
          >
            {isRegistering ? <Spinner size="sm" /> : "Create Account"}
          </Button>
        </Form>

        <p className="text-center mt-3">
          Already have account? <Link to="/login">Login</Link>
        </p>

        <div className="divider">OR</div>

        <Button className="google-btn w-100">
          <FcGoogle /> Continue with Google
        </Button>
      </div>
    </div>
  );
};

export default RegisterPage;