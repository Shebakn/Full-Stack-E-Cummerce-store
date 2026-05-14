import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/common/services/category.service";

export const CATEGORIES_KEY = ["categories"];

export const useCategories = () => {
  const query = useQuery({
    queryKey: CATEGORIES_KEY,
    queryFn: getCategories,

    staleTime: 1000 * 60 * 10, // 10 min
    gcTime: 1000 * 60 * 30,   // 30 min 

    refetchOnWindowFocus: false,

    select: (data) => data ?? [], 
  });

  return {
    ...query,
    categories: query.data,
  };
};