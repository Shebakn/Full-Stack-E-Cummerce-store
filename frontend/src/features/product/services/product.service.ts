import api from "@/api/client";
import type { Product, NewReview, Review } from "../types/product.types";

/* ================= PRODUCT SERVICES ================= */

export const productService = {
  // Get single product by ID
  getProductById: async (id: string): Promise<Product> => {
    const { data } = await api.get(`/product/${id}`);
    // Assuming API returns { data: product } or just product
    return data.data || data;
  },

  // Create new review
  createReview: async (id: string, review: NewReview): Promise<Review> => {
    const res = await api.post(`products/${id}/reviews`, review);
    console.log("Posting review : ", res)
    return res.data.data || res.data;
  },

  // // Update product rating (if needed)
  // updateProductRating: async (productId: string): Promise<void> => {
  //   await api.patch(`/products/${productId}/update-rating`);
  // },
};