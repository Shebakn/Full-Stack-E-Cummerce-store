import { create } from "zustand";

import {
  DEFAULT_PRODUCT_FILTERS,
} from "../constants/shop.constants";

import type {
  ProductQuery,
} from "../types/shop.types";

type ShopFilterStore = {
  filters: ProductQuery;

  setFilters: (
    filters: Partial<ProductQuery>
  ) => void;

  resetFilters: () => void;
};

export const useShopFilterStore =
  create<ShopFilterStore>((set) => ({
    filters: DEFAULT_PRODUCT_FILTERS,

    setFilters: (filters) =>
      set((state) => ({
        filters: {
          ...state.filters,
          ...filters,

          /*
            reset page automatically
            unless page passed manually
          */
          page:
            filters.page ??
            1,
        },
      })),

    resetFilters: () =>
      set({
        filters:
          DEFAULT_PRODUCT_FILTERS,
      }),
  }));