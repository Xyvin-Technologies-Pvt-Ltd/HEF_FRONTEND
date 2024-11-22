import { create } from "zustand";
import { getReport } from "../api/reportapi";

const useReportStore = create((set) => ({
  reports: [],

  getReports: async () => {
    const response = await getReport();
    set({ reports: response.data || [] });
  },
}));

export { useReportStore };
