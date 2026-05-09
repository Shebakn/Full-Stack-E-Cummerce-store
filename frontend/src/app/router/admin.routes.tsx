import { Route } from "react-router-dom";
import { AdminGuard } from "../guards/AdminGuard";

export const AdminRoutes = [
  <Route
    key="admin-dashboard"
    path="/admin"
    element={
      <AdminGuard>
        <div>Admin Dashboard</div>
      </AdminGuard>
    }
  />,
];