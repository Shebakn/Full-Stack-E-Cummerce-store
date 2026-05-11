import api from "@/api/client";
import type { ProductQuery } from "@/common/interfaces/product-query.interface";

/* ================= Get Best Sellers ================= */

export const getBestSellers = async (
  { categoryId, includeChildren, ...rest }: ProductQuery = {}
) => {
  try {
    const params: ProductQuery = {
      ...rest,
      ...(categoryId !== undefined && { categoryId }),
      ...(includeChildren !== undefined && { includeChildren }),
    };

    const result = await api.get("/product", {
      params,
    });

    return result.data;
  } catch (error: any) {

    throw error;
  }
};

/* ================= Get New Arrivals ================= */
export const getNewArrivals = async () => {
  try {
    const result = await api.get("/product", {
      params: {
        includeChildren: true,
        orderBy: "createdAt",
        orderDirection: "desc",
        limit: 10,
        page: 1,
      },
    });

    return result.data;
  } catch (error: any) {
    throw error;
  }
};