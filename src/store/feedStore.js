import { create } from "zustand";
import { editFeed, getFeed } from "../api/feedapi";

const useFeedStore = create((set) => ({
  feeds: [],

  fetchFeed: async () => {
    const allData = await getFeed();
    set({ feeds: allData?.data || [] });
  },
 
  updateFeed: async (action, id, data) => {
    await editFeed(action, id, data);
  },
}));

export { useFeedStore };
