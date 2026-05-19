import api from "@/api/client";

export const getRegions = async (countryId: string) => {
  const res = await api.get(`/region?countryId=${countryId}`);
  return res.data?.data;
};