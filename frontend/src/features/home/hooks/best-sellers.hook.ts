import { useQuery } from "@tanstack/react-query";
import { getBestSellers } from "../services/home.service";
import { bestSellersKeys } from "../lib/best-sellers.keys";
import type { ProductQuery } from "@/common/interfaces/product-query.interface";

export const useBestSellers = (params: ProductQuery = {}) => {
  const {
    categoryId,
    includeChildren=true,
    page,
    limit,
  } = params;

  console.log("Fetching include : ", includeChildren)
  return useQuery({
    queryKey: bestSellersKeys.list(
      categoryId,
      includeChildren,
      page,
      limit
    ),

    queryFn: () => getBestSellers(params),

    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,

    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });
};