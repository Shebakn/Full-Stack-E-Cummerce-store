import api from "@/api/client";

/* ================= LOGIN ================= */
export const login = (data: {
  email: string;
  password: string;
}) => {
  return api.post("/auth/login", data);
};

/* ================= REGISTER ================= */
export const register = (data: {
  name: string;
  email: string;
  password: string;
}) => {
  return api.post("/auth/register", data);
};

/* ================= GET PROFILE ================= */
export const getProfile = () => {
  return api.get("/profile/me");
};

// import api from "@/api/client";

// /* ================= LOGIN ================= */
// export const login = async (data: {
//   email: string;
//   password: string;
// }) => {
//   const res = await api.post(
//     "/auth/login",
//     data
//   );

//   return res.data;
// };

// /* ================= REGISTER ================= */
// export const register = async (data: {
//   name: string;
//   email: string;
//   password: string;
// }) => {
//   const res = await api.post(
//     "/auth/register",
//     data
//   );

//   return res.data;
// };

// /* ================= GET PROFILE ================= */
// export const getProfile = async () => {
//   const res = await api.get(
//     "/profile/me"
//   );

//   return res.data;
// };