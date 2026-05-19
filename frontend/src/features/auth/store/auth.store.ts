// import { create } from "zustand";
// import { persist } from "zustand/middleware";
// import type { User } from "@/common/interfaces/user.interface";

// interface AuthState {
//   // ================= STATE =================
//   user: User | null;
//   token: string | null;

//   // ================= ROLE =================
//   role?: string;
//   isAdmin: boolean;
//   isUser: boolean;

//   // ================= DERIVED (NOT STORED LOGICALLY) =================
//   isAuthenticated: boolean;

//   // ================= ACTIONS =================
//   setAuth: (user: User, token: string) => void;
//   updateUser: (user: User) => void;
//   logout: () => void;
// }

// export const useAuthStore = create<AuthState>()(
//   persist(
//     (set, get) => ({
//       // ================= INITIAL STATE =================
//       user: null,
//       token: null,

//       role: undefined,
//       isAdmin: false,
//       isUser: false,

//       // 🔥 لا نخزنها بشكل يعتمد عليه
//       isAuthenticated: false,

//       // ================= SET AUTH =================
//       setAuth: (user, token) =>
//         set({
//           user,
//           token,

//           role: user.role,
//           isAdmin: user.role === "ADMIN",
//           isUser: user.role === "USER",

//           // 🔥 derived
//           isAuthenticated: !!user && !!token,
//         }),

//       // ================= UPDATE USER =================
//       updateUser: (user) =>
//         set((state) => ({
//           user,

//           role: user.role,
//           isAdmin: user.role === "ADMIN",
//           isUser: user.role === "USER",

//           isAuthenticated: !!user && !!state.token,
//         })),

//       // ================= LOGOUT =================
//       logout: () =>
//         set({
//           user: null,
//           token: null,

//           role: undefined,
//           isAdmin: false,
//           isUser: false,

//           isAuthenticated: false,
//         }),
//     }),
//     {
//       name: "auth-storage",

//       // 🔥 نخزن فقط البيانات الأساسية
//       partialize: (state) => ({
//         user: state.user,
//         token: state.token,
//         role: state.role,
//         isAdmin: state.isAdmin,
//         isUser: state.isUser,
//       }),
//     }
//   )
// );