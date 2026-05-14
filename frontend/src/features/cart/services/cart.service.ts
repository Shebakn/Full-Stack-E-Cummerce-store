import api from "@/api/client";
import type { CartResponse } from "../types/cart.type";

/* ========================================================= */
/* ERROR HANDLER */
/* ========================================================= */

const handleApiError = (error: any): never => {
  throw {
    message:
      error?.response?.data?.error?.message ||
      error?.response?.data?.message ||
      error?.message ||
      "Something went wrong",
    details: error?.response?.data?.error?.details,
  };
};

/**
 * backend response shape:
 * {
 *   statusCode,
 *   timestamp,
 *   data: { ...cart }
 * }
 */
const extract = <T>(res: any): T => res.data;

/* ========================================================= */
/* GET CART */
/* ========================================================= */

export const getCart = async (): Promise<CartResponse> => {
  try {
    const res = await api.get("/cart");
    return extract<CartResponse>(res);
  } catch (err) {
    handleApiError(err);
  }
};

/* ========================================================= */
/* ADD ITEM */
/* ========================================================= */

export interface AddCartItemPayload {
  productId: string;
  variantId?: string;
  quantity: number;
}

export const addCartItem = async (
  payload: AddCartItemPayload
): Promise<CartResponse> => {
  try {
    const res = await api.post("/cart/items", payload);
    return extract<CartResponse>(res);
  } catch (err) {
    handleApiError(err);
  }
};

/* ========================================================= */
/* UPDATE ITEM */
/* ========================================================= */

export interface UpdateCartItemPayload {
  id: string;
  quantity: number;
}

export const updateCartItem = async (
  payload: UpdateCartItemPayload
): Promise<CartResponse> => {
  try {
    const res = await api.patch(`/cart/items/${payload.id}`, {
      quantity: payload.quantity,
    });

    return extract<CartResponse>(res);
  } catch (err) {
    handleApiError(err);
  }
};

/* ========================================================= */
/* REMOVE ITEM */
/* ========================================================= */

export const removeCartItem = async (
  id: string
): Promise<CartResponse> => {
  try {
    const res = await api.delete(`/cart/items/${id}`);
    return extract<CartResponse>(res);
  } catch (err) {
    handleApiError(err);
  }
};

/* ========================================================= */
/* CLEAR CART */
/* ========================================================= */

export const clearCart = async (): Promise<CartResponse> => {
  try {
    const res = await api.delete("/cart");
    return extract<CartResponse>(res);
  } catch (err) {
    handleApiError(err);
  }
};

/* ========================================================= */
/* COUPON */
/* ========================================================= */

export const applyCoupon = async (
  couponId: string
): Promise<CartResponse> => {
  try {
    const res = await api.post("/cart/coupon", {
      couponId,
    });

    return extract<CartResponse>(res);
  } catch (err) {
    handleApiError(err);
  }
};

export const removeCoupon = async (): Promise<CartResponse> => {
  try {
    const res = await api.delete("/cart/coupon");
    return extract<CartResponse>(res);
  } catch (err) {
    handleApiError(err);
  }
};