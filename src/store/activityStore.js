import { create } from "zustand";
import { createActivity, deleteActivity } from "../api/activityapi";

const useActivityStore = create((set) => ({
  addActivity: async (data) => {
    await createActivity(data);
  },
  removeActivity: async (id) => {
    await deleteActivity(id);
  },
}));

export default useActivityStore;
