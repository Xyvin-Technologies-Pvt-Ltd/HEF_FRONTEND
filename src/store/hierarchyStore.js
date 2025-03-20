import { create } from "zustand";
import {
  createLevel,
  deleteLevel,
  editLevel,
  getLevelById,
} from "../api/hierarchyapi";

const useHierarchyStore = create((set) => ({
  level: [],
  addLevel: async (type, data) => {
    await createLevel(type, data);
  },

  fetchLevelById: async (type, filter) => {
    const allData = await getLevelById(type, filter);
    set({ level: allData?.data || [] });
  },
  updateLevel: async (type, data, filter) => {
    await editLevel(type, data, filter);
  },
  deleteLevels: async (type, filter) => {
    await deleteLevel(type, filter);
  },
}));

export default useHierarchyStore;
