import axiosClient from "./axiosClient";

export const  getCategories = async () => {
  const res = await axiosClient.get("/category/roots");

  return res.data.data;
};

export const getCategoriesWithChildren = async (categoryId?: string) => {
  // CASE 1: جلب كاتيجوري معين
  if (categoryId) {
    const res = await axiosClient.get(`/category/${categoryId}`);
    return res.data.data;
  }

  // CASE 2: جلب كل الكاتيجوريز مع children
  const res = await axiosClient.get("/category");
  return res.data.data;
};