import api from "@/api/client";

import type {
  ProductQuery,
  ProductsResponse,
} from "../types/shop.types";
import type { Category } from "../types/category.types";

export const getProducts = async (
  params: ProductQuery
): Promise<ProductsResponse> => {
  const fixedParams = {
    ...params,

    categoryIds: params.categoryIds?.length
      ? params.categoryIds.join(",")
      : undefined,

    ratings: params.ratings?.length
      ? params.ratings.join(",")
      : undefined,
  };

  const { data } = await api.get("/product", {
    params: fixedParams,
  });

  return data;
};

export const getCategories =
  async (): Promise<Category[]> => {
    const { data } =
      await api.get(
        "/category",
        {
          params: {
            includeChildren: true,
          },
        }
      );

    return data.data ?? [];
  };