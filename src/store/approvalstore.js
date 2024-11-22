import { create } from "zustand";
import { editApproval, getApproval } from "../api/approvalapi";

const useApprovalStore = create((set) => ({
  approvals: [],
  fetchApproval: async () => {
    const allData = await getApproval();
    set({ approvals: allData?.data || [] });
  },
  updateApproval: async (id, data) => {
    await editApproval(id, data);
  },
}));

export { useApprovalStore };
