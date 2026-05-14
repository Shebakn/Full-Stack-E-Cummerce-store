import { Navigate, Outlet } from "react-router-dom";
import { useAuthUser } from "../../features/auth/hooks/auth-user"; 

export const AdminGuard = () => {
  const { isAuthenticated, isAdmin } =
    useAuthUser();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};