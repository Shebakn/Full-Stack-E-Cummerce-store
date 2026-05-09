import { create } from "zustand";
import { persist } from "zustand/middleware";

type ProductUIState = {
  selectedVariant: string | null;
  quantity: number;
  activeTab: "description" | "reviews";
  
  // Actions
  setVariant: (id: string | null) => void;
  setQuantity: (q: number) => void;
  setTab: (tab: "description" | "reviews") => void;
  reset: () => void;
};

export const useProductUIStore = create<ProductUIState>()(
  persist(
    (set) => ({
      selectedVariant: null,
      quantity: 1,
      activeTab: "description",

      setVariant: (id) => set({ selectedVariant: id }),
      setQuantity: (q) => set({ quantity: q }),
      setTab: (tab) => set({ activeTab: tab }),
      reset: () =>
        set({
          selectedVariant: null,
          quantity: 1,
          activeTab: "description",
        }),
    }),
    {
      name: "product-ui-storage", // only persist for specific fields
      partialize: (state) => ({ selectedVariant: state.selectedVariant }),
    }
  )
);