import {
  useEffect,
} from "react";

import {
  useCategoryStore,
} from "../stores/category.store";

export const useCategories =
  () => {
    const categories =
      useCategoryStore(
        (state) =>
          state.categories
      );

    const loading =
      useCategoryStore(
        (state) =>
          state.loading
      );

    const fetchCategories =
      useCategoryStore(
        (state) =>
          state.fetchCategories
      );

    useEffect(() => {
      if (
        categories.length
      ) {
        return;
      }

      fetchCategories();
    }, []);

    return {
      categories,
      loading,
    };
  };