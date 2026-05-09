import api from "@/api/client";

export const getCategories = async () => {
  console.log("Categories request...");

  const res = await api.get("/category");

  console.log("Categories:", res.data.data);

  return res.data.data;
};