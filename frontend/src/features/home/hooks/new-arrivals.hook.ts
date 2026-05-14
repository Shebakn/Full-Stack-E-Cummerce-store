import { useQuery } from "@tanstack/react-query";
import { getNewArrivals } from "../services/home.service";

export const useNewArrivals = () => {
  return useQuery({
    queryKey: ["products", "new-arrivals"],
    queryFn: getNewArrivals,

    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,

    refetchOnWindowFocus: false,
  });
};