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

    console.log(categoryId)

    const result = await api.get("/product", {
      params,
    });

    console.log("BEST SELLERS:", result.data);

    return result.data;
  } catch (error: any) {
    console.log("API ERROR:", error.response?.data);
    console.log("STATUS:", error.response?.status);

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
    console.log("NEW ARRIVALS ERROR:", error.response?.data);
    throw error;
  }
};