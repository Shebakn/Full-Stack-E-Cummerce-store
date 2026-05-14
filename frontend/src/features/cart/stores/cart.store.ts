// stores/cart.store.ts

import { create } from "zustand";

import type {
  CartData,
  CartItem,
} from "../types/cart.types";

interface CartStore {
  cart: CartData | null;

  setCart: (
    cart: CartData | null
  ) => void;

  updateItemQuantity: (
    itemId: string,
    quantity: number
  ) => void;

  removeItem: (
    itemId: string
  ) => void;

  clearCart: () => void;
}

/* ================================= */

const calculateTotals = (
  items: CartItem[]
) => {
  const totalPrice = items.reduce(
    (acc, item) =>
      acc + item.price * item.quantity,
    0
  );

  return {
    totalPrice,

    totalPriceAfterDiscount:
      totalPrice,

    cartCount: items.reduce(
      (acc, item) =>
        acc + item.quantity,
      0
    ),
  };
};

/* ================================= */

export const useCartStore =
  create<CartStore>((set) => ({
    cart: null,

    setCart: (cart) =>
      set({
        cart,
      }),

    updateItemQuantity: (
      itemId,
      quantity
    ) =>
      set((state) => {
        if (!state.cart)
          return state;

        const cartItems =
          state.cart.cartItems.map(
            (item) =>
              item.id === itemId
                ? {
                    ...item,
                    quantity,
                  }
                : item
          );

        const totals =
          calculateTotals(cartItems);

        return {
          cart: {
            ...state.cart,
            cartItems,
            ...totals,
          },
        };
      }),

    removeItem: (itemId) =>
      set((state) => {
        if (!state.cart)
          return state;

        const cartItems =
          state.cart.cartItems.filter(
            (item) =>
              item.id !== itemId
          );

        const totals =
          calculateTotals(cartItems);

        return {
          cart: {
            ...state.cart,
            cartItems,
            ...totals,
          },
        };
      }),

    clearCart: () =>
      set({
        cart: null,
      }),
  }));