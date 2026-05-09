import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { User } from "@/common/interfaces/user.interface";

interface AuthState {
  user: User | null;
  token: string | null;

  isHydrated: boolean;
  setHydrated: (state: boolean) => void;

  isAuthenticated: boolean;
  isAdmin: boolean;

  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,

      isHydrated: false,
      setHydrated: (state) =>
        set({ isHydrated: state }),

      isAuthenticated: false,
      isAdmin: false,

      setAuth: (user, token) =>
        set({
          user,
          token,
          isAuthenticated: true,
          isAdmin: user.role === "ADMIN",
        }),

      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isAdmin: false,
        }),
    }),
    {
      name: "auth-storage",

      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);