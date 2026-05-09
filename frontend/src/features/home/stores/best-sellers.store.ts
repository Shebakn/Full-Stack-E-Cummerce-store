import { create } from "zustand";
import type { ProductQuery } from "@/common/interfaces/product-query.interface";

interface BestSellersStore {
  filters: ProductQuery;
  setFilters: (filters: Partial<ProductQuery>) => void;
  resetFilters: () => void;
}

const initialState: ProductQuery = {
  categoryId: undefined,
  includeChildren: true,
  page: 1,
  limit: 10,
};

export const useBestSellersStore = create<BestSellersStore>((set) => ({
  filters: initialState,

  setFilters: (filters) =>
  set((state) => ({
    filters: {
      ...state.filters,
      ...filters,
    },
  })),

  resetFilters: () =>
    set(() => ({ filters: initialState })),
}));