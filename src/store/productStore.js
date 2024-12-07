import { create } from "zustand";
import { editProduct } from "../api/productapi";

const useProductStore = create((set) => ({


  updateProduct: async (id, data) => {
    await editProduct(id, data);
  },
}));

export { useProductStore };
