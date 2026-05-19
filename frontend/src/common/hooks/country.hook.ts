import { useQuery } from "@tanstack/react-query";
import { getCountries } from "../services/country.service"; 

export const COUNTRIES_KEY = ["countries"];

export const useCountries = () => {
  const query = useQuery({
    queryKey: COUNTRIES_KEY,
    queryFn: getCountries,

    staleTime: 1000 * 60 * 10, // 10 min
    gcTime: 1000 * 60 * 30, // 30 min

    refetchOnWindowFocus: false,

    select: (data) => data ?? [],
  });

  return {
    ...query,
    countries: query.data,
  };
};