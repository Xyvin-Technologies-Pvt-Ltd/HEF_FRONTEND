import { create } from "zustand";
import { deleteFeed, editFeed, getFeed } from "../api/feedapi";

const useFeedStore = create((set) => ({
  feeds: [],

  fetchFeed: async () => {
    const allData = await getFeed();
    set({ feeds: allData?.data || [] });
  },
 
  updateFeed: async (action, id, data) => {
    await editFeed(action, id, data);
  },
  deleteFeeds: async (id) => {
    await deleteFeed(id);
  },
}));

export { useFeedStore };
