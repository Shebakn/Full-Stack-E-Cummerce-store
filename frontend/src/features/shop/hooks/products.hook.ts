import { useQuery } from "@tanstack/react-query";

import { getProducts } from "@/features/shop/services/shop.service";

import { useProductStore } from "@/features/shop/stores/products.store"; 

import type {
  ProductsResponse,
} from "@/features/shop/types/shop.types";

/* ================= HOOK ================= */

export const useProducts = () => {
  const query = useProductStore(
    (state) => state.query
  );

  const queryResult =
    useQuery<ProductsResponse>({
      queryKey: ["products", query],

      queryFn: () => getProducts(query),

      placeholderData: (prev) => prev,

      staleTime: 1000 * 60 * 5,
    });

  return {
    /* DATA */

    products:
      queryResult.data?.data ?? [],

    meta:
      queryResult.data?.meta ?? null,

    /* LOADING */

    loading:
      queryResult.isLoading ||
      queryResult.isFetching,

    isLoading:
      queryResult.isLoading,

    isFetching:
      queryResult.isFetching,

    /* ERROR */

    error: queryResult.error,

    /* REFETCH */

    refetch: queryResult.refetch,
  };
};