import { ReactNode } from "react";
import { BrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "./ThemeProvider";
import { AppRouter } from "../router";
import { Toaster } from "react-hot-toast";
type Props = {
  children?: ReactNode;
};

export const AppProviders = ({ children }: Props) => {
  return (
    <ThemeProvider>
      <RouterProvider router={AppRouter} />
      <Toaster position="top-right" />
      {children}
    </ThemeProvider>
  );
};