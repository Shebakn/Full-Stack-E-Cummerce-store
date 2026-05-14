import api from "@/api/client";

interface GetCategoriesParams {
  includeChildren?: boolean;
}

export const getCategories = async (params: GetCategoriesParams = {}) => {

  const res = await api.get("/category", {
    params: {
      includeChildren: params.includeChildren ?? true,
    },
  });

  return res.data.data;
};