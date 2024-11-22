import { create } from "zustand";

import {
  getPromotion,
  addPromotion,
  deletePromotion,
  editPromotion,
  getPromotionById,
} from "../api/promotionapi";

const usePromotionStore = create((set) => ({
  promotions: [],
  promotion: [],

  fetchPromotion: async (filter) => {
    const allData = await getPromotion(filter);
    set({ promotions: allData?.data || [] });
  },
  addPromotions: async (data) => {
    await addPromotion(data);
  },
  deletePromotions: async (id) => {
    await deletePromotion(id);
  },
  fetchPromotionById: async (id) => {
    const allData = await getPromotionById(id);
    set({ promotion: allData?.data || [] });
  },
  updatePromotion: async (id, data) => {
    await editPromotion(id, data);
  },
}));

export { usePromotionStore };
