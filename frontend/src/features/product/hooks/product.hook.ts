import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productService } from "../services/product.service";
import type { NewReview, Review } from "../types/product.types";
import { toast } from "react-hot-toast";

// Query keys
export const productKeys = {
  all: ["products"] as const,
  details: () => [...productKeys.all, "detail"] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
  reviews: (productId: string) => [...productKeys.detail(productId), "reviews"] as const,
};

// Hook to fetch single product
export const useProduct = (id?: string) => {
  return useQuery({
    queryKey: productKeys.detail(id!),
    queryFn: () => productService.getProductById(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
};

// Hook to submit review
export const useSubmitReview = ( id: string ) => {
  const queryClient = useQueryClient();

  
  return useMutation({
    mutationFn: (review: NewReview) => productService.createReview(id , review),
    onSuccess: (newReview, variables) => {
      // Invalidate and refetch product to update reviews and ratings
      queryClient.invalidateQueries({
        queryKey: productKeys.detail(variables.productId),
      });
      
      toast.success("Review submitted successfully!");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to submit review");
    },
  });
};