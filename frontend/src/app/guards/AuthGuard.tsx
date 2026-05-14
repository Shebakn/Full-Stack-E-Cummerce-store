import { Navigate, Outlet } from "react-router-dom";
import { useAuthUser } from "@/features/auth/hooks/auth-user";

export const AuthGuard = () => {
  const { isLoading ,isAuthenticated } = useAuthUser();

  if (isLoading){
    return <div>Loading...</div>
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};