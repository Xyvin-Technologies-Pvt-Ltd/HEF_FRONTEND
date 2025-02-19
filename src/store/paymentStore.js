import { create } from "zustand";
import { addParentSub, addPayment, deletePayment, editPayment, editPaymentSub, getParentSub, getPaymentById, getSinglePayment, getSubById, patchPayment } from "../api/paymentapi";

const usePaymentStore = create((set) => ({
  refreshMember: false,
  sub: [],
  singlePayment: [],
  payment: [],
  subscriptions: [],
  addParentSubscription: async (data) => {
    await addParentSub(data);
  },
  addPayments: async (data) => {
    await addPayment(data);
  },
  patchPayments: async (id, data) => {
    await patchPayment(id, data);
  },
  deletePayments: async (id) => {
    await deletePayment(id);
  },
  editParentSub: async (id, data) => {
    await editPaymentSub(id, data);
  },
  fetchParentSub: async () => {
    const allData = await getParentSub();
    set({ subscriptions: allData?.data || [] });
  },
  updatePayment: async (id, data) => {
    await editPayment(id, data);
  },
  setRefreshMember: () =>
    set((state) => ({ refreshMember: !state.refreshMember })),
  fetchParentSubByiD: async (id) => {
    const allData = await getSubById(id);
    set({ sub: allData?.data || [] });
  },
  fetchPaymentById: async (id) => {
    const allData = await getPaymentById(id);
    set({ payment: allData?.data || [] });
  },

  fetchSinglePayment: async (id) => {
    const allData = await getSinglePayment(id);
    set({ singlePayment: allData?.data || [] });
  },
}));

export { usePaymentStore };
