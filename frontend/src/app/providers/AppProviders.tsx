import { ReactNode } from "react";
import { BrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "./ThemeProvider";
import { AppRouter } from "../router";

type Props = {
  children?: ReactNode;
};

export const AppProviders = ({ children }: Props) => {
  return (
    <ThemeProvider>
      <RouterProvider router={AppRouter} />
      {children}
    </ThemeProvider>
  );
};