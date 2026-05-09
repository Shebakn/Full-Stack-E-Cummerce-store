import { create } from "zustand";

import { getCategories }
from "../services/category.service";

import type {
  Category,
} from "../types/category.types";

type CategoryStore = {
  categories: Category[];

  loading: boolean;

  fetchCategories:
    () => Promise<void>;
};

export const useCategoryStore =
  create<CategoryStore>(
    (set) => ({
      categories: [],

      loading: false,

      fetchCategories:
        async () => {
          set({
            loading: true,
          });

          try {
            const data =
              await getCategories();

            set({
              categories: data,
              loading: false,
            });
          } catch (
            error
          ) {
            console.error(
              error
            );

            set({
              loading: false,
            });
          }
        },
    })
  );