import { Route } from "react-router-dom";
import { AuthGuard } from "../guards/AuthGuard";

export const PrivateRoutes = [
  <Route
    key="cart"
    path="/cart"
    element={
      <AuthGuard>
        <div>Cart Page</div>
      </AuthGuard>
    }
  />,
];