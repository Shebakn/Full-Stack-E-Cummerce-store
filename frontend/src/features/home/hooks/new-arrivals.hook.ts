import { useQuery } from "@tanstack/react-query";
import { getNewArrivals } from "../services/home.service";

export const NEW_ARRIVALS_KEY = "new-arrivals";

export const useNewArrivals = () => {
  return useQuery({
    queryKey: [NEW_ARRIVALS_KEY],
    queryFn: getNewArrivals,

    staleTime: 1000 * 60 * 5, // 5 min cache
    gcTime: 1000 * 60 * 30,   // 30 min memory

    refetchOnWindowFocus: false,
  });
};