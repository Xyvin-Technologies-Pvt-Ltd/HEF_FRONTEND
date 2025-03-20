import { create } from "zustand";
import {
  createLevel,
  deleteLevel,
  editLevel,
  getLevelById,
} from "../api/hierarchyapi";

const useHierarchyStore = create((set) => ({
  level: [],
  loading: false,
  addLevel: async (type, data) => {
    await createLevel(type, data);
  },

  fetchLevelById: async (type, filter) => {
    set({ loading: true });
    const allData = await getLevelById(type, filter);
    set({ level: allData?.data || [] });
    set({ loading: false });
  },
  updateLevel: async (type, data, filter) => {
    await editLevel(type, data, filter);
  },
  deleteLevels: async (type, filter) => {
    await deleteLevel(type, filter);
  },
}));

export default useHierarchyStore;
