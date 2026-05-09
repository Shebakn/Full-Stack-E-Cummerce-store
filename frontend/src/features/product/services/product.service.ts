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
  createReview: async (review: NewReview): Promise<Review> => {
    const { data } = await api.post(`/reviews`, review);
    return data.data || data;
  },

  // Update product rating (if needed)
  updateProductRating: async (productId: string): Promise<void> => {
    await api.patch(`/product/${productId}/update-rating`);
  },
};