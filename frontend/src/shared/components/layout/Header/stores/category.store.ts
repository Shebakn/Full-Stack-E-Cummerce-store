import { create } from "zustand";

type Category = {
  id: string;
  name: string;
};

interface CategoryUIState {
  selectedCategory: Category | null;

  setSelectedCategory: (cat: Category | null) => void;
}

export const useCategoriesStore = create<CategoryUIState>((set) => ({
  selectedCategory: null,
  setSelectedCategory: (cat) => set({ selectedCategory: cat }),
}));