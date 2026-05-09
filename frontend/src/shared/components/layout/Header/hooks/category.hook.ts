import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../services/category.service";

export const useCategories = () => {
  const query = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: 1000 * 60 * 10, // 10 min cache
  });

  return {
    categories: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
  };
};