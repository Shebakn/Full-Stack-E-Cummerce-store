// // features/auth/hooks/useInitAuth.ts

// import { useEffect, useState } from "react";

// import { getProfile } from "@/features/auth/services/auth.service";
// import { useAuthStore } from "@/features/auth/store/auth.store";

// export const useInitAuth = () => {
//   const [isInitializing, setIsInitializing] =
//     useState(true);

//   const {
//     setAuth,
//     logout,
//   } = useAuthStore();

//   useEffect(() => {
//     const init = async () => {
//       try {
//         // 🔥 انتظر hydration
//         await useAuthStore.persist.rehydrate();

//         // 🔥 خذ أحدث token
//         const currentToken =
//           useAuthStore.getState().token;

//         // ما فيه token
//         if (!currentToken) {
//           return;
//         }

//         // تحقق من السيرفر
//         const res = await getProfile();

//         // 🔥 استخدم currentToken
//         setAuth(
//           res.data,
//           currentToken
//         );
//       } catch (error) {
//         logout();
//       } finally {
//         setIsInitializing(false);
//       }
//     };

//     init();
//   }, []);

//   return {
//     isInitializing,
//   };
// };