import { create } from "zustand";
import { createChapter, createDistrict, createState, createZone } from "../api/hierarchyapi";


const useHierarchyStore = create((set) => ({
  addState: async (data) => {
    await createState(data);
  },
  addZone: async (data) => {
    await createZone(data);
  },
  addDistrict: async (data) => {
    await createDistrict(data);
  },
  addChapter: async (data) => {
    await createChapter(data);
  },

}));

export default useHierarchyStore;
