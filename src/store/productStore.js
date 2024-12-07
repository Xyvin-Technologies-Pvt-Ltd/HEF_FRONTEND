import { create } from "zustand";
import {
  createProduct,
  deleteProductById,
  editProduct,
  getProductById,
} from "../api/productapi";

const useProductStore = create((set) => ({
  product: [],
  updateProduct: async (id, data) => {
    await editProduct(id, data);
  },
  addProduct: async (data) => {
    await createProduct(data);
  },
  fetchProductById: async (id) => {
    const allData = await getProductById(id);
    set({ product: allData?.data || [] });
  },
  deleteProduct: async (id) => {
    await deleteProductById(id);
  },
}));

export { useProductStore };
