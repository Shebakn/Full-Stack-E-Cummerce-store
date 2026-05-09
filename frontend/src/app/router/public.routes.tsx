import { Route } from "react-router-dom";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { RegisterPage } from "@/features/auth/pages/RegisterPage";

export const PublicRoutes = [
  <Route
    key="admin-dashboard"
    path="/home"
    element={
        <div>Home page</div>
    }
  />,

  <Route
    key="admin-dashboard"
    path="/login"
    element={
        <LoginPage />
    }
  />,

  <Route
    key="admin-dashboard"
    path="/register"
    element={
        <RegisterPage />
    }
  />,
];