// features/auth/store/auth.store.ts

import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { User } from "@/common/interfaces/user.interface";

interface AuthState {
  // ================= STATE =================
  user: User | null;
  token: string | null;

  // ================= DERIVED AUTH =================
  isAuthenticated: boolean;

  // ================= ROLE =================
  role: string | undefined;
  isAdmin: boolean;
  isUser: boolean;

  // ================= ACTIONS =================
  setAuth: (user: User, token: string) => void;
  updateUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // ================= INITIAL STATE =================
      user: null,
      token: null,

      isAuthenticated: false,

      role: undefined,
      isAdmin: false,
      isUser: false,

      // ================= SET AUTH =================
      setAuth: (user, token) =>
        set({
          user,
          token,

          // auth
          isAuthenticated:
            !!user && !!token,

          // role
          role: user.role,

          isAdmin:
            user.role === "ADMIN",

          isUser:
            user.role === "USER",
        }),

      // ================= UPDATE USER =================
      updateUser: (user) =>
        set((state) => ({
          user,

          role: user.role,

          isAdmin:
            user.role === "ADMIN",

          isUser:
            user.role === "USER",

          isAuthenticated:
            !!user && !!state.token,
        })),

      // ================= LOGOUT =================
      logout: () =>
        set({
          user: null,
          token: null,

          isAuthenticated: false,

          role: undefined,
          isAdmin: false,
          isUser: false,
        }),
    }),
    {
      name: "auth-storage",

      // 🔥 لا تحفظ الميثودز
      partialize: (state) => ({
        user: state.user,
        token: state.token,

        isAuthenticated:
          state.isAuthenticated,

        role: state.role,
        isAdmin: state.isAdmin,
        isUser: state.isUser,
      }),
    }
  )
);