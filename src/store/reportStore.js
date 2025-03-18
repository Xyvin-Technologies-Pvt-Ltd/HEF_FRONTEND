import { create } from "zustand";
import { getReportById } from "../api/reportapi";

const useReportStore = create((set) => ({
  report: [],

  fetchReportById: async (id) => {
    const allData = await getReportById(id);
    set({ report: allData?.data || [] });
  },
}));

export { useReportStore };
