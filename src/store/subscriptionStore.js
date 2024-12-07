import { create } from "zustand";
import {
  createSubscription,
  getSubscriptionById,
  renewSubscription,
} from "../api/subscriptionapi";

const useSubscriptionStore = create((set) => ({
  subscription: [],
  addSubscription: async (data) => {
    await createSubscription(data);
  },
  fetchSubscriptionById: async (id) => {
    const allData = await getSubscriptionById(id);
    set({ subscription: allData?.data || [] });
  },
  updateSubscription: async (id, data) => {
    await renewSubscription(id, data);
  },
}));

export default useSubscriptionStore;
