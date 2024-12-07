import { create } from "zustand";
import { createSubscription } from "../api/subscriptionapi";

const useSubscriptionStore = create((set) => ({
  addSubscription: async (data) => {
    await createSubscription(data);
  },
}));

export default useSubscriptionStore;
