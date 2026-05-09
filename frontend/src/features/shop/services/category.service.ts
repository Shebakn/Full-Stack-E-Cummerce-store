
import api from "@/api/client";

import type {
  Category,
} from "../types/category.types";

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