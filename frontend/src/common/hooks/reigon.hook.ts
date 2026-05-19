import { useQuery } from "@tanstack/react-query";
import { getRegions } from "../services/reigon.service"; 

export const REGIONS_KEY = (countryId: string) => [
  "regions",
  countryId,
];

export const useRegions = (countryId?: string) => {
  const query = useQuery({
    queryKey: REGIONS_KEY(countryId || ""),
    queryFn: () => getRegions(countryId as string),

    enabled: !!countryId, // 👈 لا يشتغل بدون دولة

    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,

    refetchOnWindowFocus: false,

    select: (data) => data ?? [],
  });

  return {
    ...query,
    regions: query.data,
  };
};