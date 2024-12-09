import { create } from "zustand";
import { createActivity } from "../api/activityapi";

const useActivityStore = create((set) => ({
  addActivity: async (data) => {
    await createActivity(data);
  },
}));

export default useActivityStore;
