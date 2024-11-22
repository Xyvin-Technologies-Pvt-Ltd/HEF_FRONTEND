import { create } from "zustand";
import { editFeed, getFeed, getFeedByUser } from "../api/feedapi";

const useFeedStore = create((set) => ({
  feeds: [],

  fetchFeed: async () => {
    const allData = await getFeed();
    set({ feeds: allData?.data || [] });
  },
  fetchFeedByUser: async (id) => {
    const allData = await getFeedByUser(id);
    set({ feeds: allData?.data || [] });
  },
  updateFeed: async (action, id, data) => {
    await editFeed(action, id, data);
  },
}));

export { useFeedStore };
