import { create } from "zustand";
import {
  addCategory,
  deleteCategory,
  editCategory,
  getCategoryById,
} from "../api/categoryapi";

const useCategoryStore = create((set) => ({
  singleCategory: null,
  trigger: false,
  setTrigger: () => set((state) => ({ trigger: !state.trigger })),
  fetchCategoryById: async (id) => {
    const response = await getCategoryById(id);
    set({ singleCategory: response?.data || null });
  },
  addCategory: async (data) => await addCategory(data),
  editCategory: async (id, data) => await editCategory(id, data),
  deleteCategory: async (id) => await deleteCategory(id),
}));

export { useCategoryStore };

