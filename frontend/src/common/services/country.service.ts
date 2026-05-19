import api from "@/api/client";

export const getCountries = async () => {
  const res = await api.get("/country");
  return res.data.data;
};
