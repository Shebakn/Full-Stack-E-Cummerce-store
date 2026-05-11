import { createBrowserRouter } from "react-router-dom";

import { MainLayout } from "@/layouts/MainLayout";

import { AuthGuard } from "../guards/AuthGuard"; 
import { AdminGuard } from "../guards/AdminGuard"; 

import LoginPage from "../../features/auth/pages/Login/LoginPage";
import HomePage from "@/features/home/pages";
import Shop from "@/features/shop/pages";
import ProductDetails from "../../features/product/pages";
import RegisterPage from "../../features/auth/pages/RegisterPage";



export const AppRouter = createBrowserRouter([
  // ================= PUBLIC =================
  {
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
      {
        path: "/shop",
        element: <Shop />,
      },
      {
        path: "/product/:id",
        element: <ProductDetails />,
      },
    ],
  },

  // ================= USER PROTECTED =================
  {
    element: <AuthGuard />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            path: "/profile",
            element: <div>Profile</div>,
          },
        ],
      },
    ],
  },

  // ================= ADMIN =================
  // {
  //   element: <AdminGuard />,
  //   children: [
  //     {
  //       element: <AdminLayout />,
  //       children: [
  //         {
  //           path: "/admin",
  //           element: <div>Admin Dashboard</div>,
  //         },
  //       ],
  //     },
  //   ],
  // },
]);