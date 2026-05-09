import { create } from "zustand";

/* ================= TYPES ================= */

export type ProductQuery = {
  page?: number;
  limit?: number;

  search?: string;

  categoryId?: string;
  categoryIds?: string[];

  brandId?: string;

  minPrice?: number;
  maxPrice?: number;

  ratings?: number[];

  orderBy?: "createdAt" | "price" | "ratingsAverage";

  orderDirection?: "asc" | "desc";

  includeChildren?: boolean;
};

/* ================= INITIAL QUERY ================= */

export const initialProductQuery: ProductQuery = {
  page: 1,
  limit: 12,

  includeChildren: true,

  orderBy: "createdAt",
  orderDirection: "desc",
};

/* ================= STORE ================= */

type ProductStore = {
  query: ProductQuery;

  setQuery: (q: Partial<ProductQuery>) => void;

  resetQuery: () => void;

  clearFilters: () => void;
};

export const useProductStore = create<ProductStore>((set) => ({
  query: initialProductQuery,

  setQuery: (q) => {
    set((state) => {
      const isPaginationOnly =
        Object.keys(q).length === 1 &&
        "page" in q;

      return {
        query: {
          ...state.query,
          ...q,

          // reset page automatically
          page: isPaginationOnly
            ? q.page
            : 1,
        },
      };
    });
  },

  resetQuery: () => {
    set({
      query: initialProductQuery,
    });
  },

  clearFilters: () => {
    set((state) => ({
      query: {
        ...initialProductQuery,

        // optional
        search: state.query.search,
      },
    }));
  },
}));