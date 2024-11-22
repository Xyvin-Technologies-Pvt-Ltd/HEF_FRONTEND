import { create } from "zustand";
import { getPayment } from "../api/paymentapi";

const usePaymentStore = create((set) => ({
  payments: [],

  fetchPayment: async () => {
    const allData = await getPayment();
    set({ payments: allData?.data || [] });
  },
}));

export { usePaymentStore };
