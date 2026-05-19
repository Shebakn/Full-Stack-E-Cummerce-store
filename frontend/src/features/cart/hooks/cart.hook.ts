import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
  clearCart,
  applyCoupon,
  removeCoupon,
} from "@/features/cart/services/cart.service";
import { getToken } from "../../../common/utils/auth-token";
import { useAuthUser } from "../../auth/hooks/auth-user";

/* ========================================================= */
/* QUERY KEYS */
/* ========================================================= */

export const cartKeys = {
  all: ["cart"] as const,
  detail: () => [...cartKeys.all, "detail"] as const,
};

/* ========================================================= */
/* GET CART */
/* ========================================================= */

export const useCart = () => {
  const token = getToken();
  const { isAuthenticated } = useAuthUser();

  return useQuery({
    queryKey: cartKeys.detail(),
    queryFn: getCart,

    enabled: isAuthenticated && !!token,

    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 1000 * 10, // 10 sec
  });
};

/* ========================================================= */
/* MUTATIONS */
/* ========================================================= */

const invalidateCart = (queryClient: any) => {
  queryClient.invalidateQueries({
    queryKey: cartKeys.all,
  });
};

/* ================= ADD ITEM ================= */

export const useAddCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addCartItem,
    onSuccess: () => invalidateCart(queryClient),
  });
};

/* ================= UPDATE ITEM ================= */

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCartItem,
    onSuccess: () => invalidateCart(queryClient),
  });
};

/* ================= REMOVE ITEM ================= */

export const useRemoveCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeCartItem,
    onSuccess: () => invalidateCart(queryClient),
  });
};

/* ================= CLEAR CART ================= */

export const useClearCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clearCart,
    onSuccess: () => invalidateCart(queryClient),
  });
};

/* ================= COUPON ================= */

export const useApplyCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: applyCoupon,
    onSuccess: () => invalidateCart(queryClient),
  });
};

export const useRemoveCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeCoupon,
    onSuccess: () => invalidateCart(queryClient),
  });
};