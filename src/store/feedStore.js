import { create } from "zustand";
import { deleteFeed, editFeed, getFeed, getFeedById } from "../api/feedapi";

const useFeedStore = create((set) => ({
  feeds: [],
  updateFeed: async (action, id, data) => {
    await editFeed(action, id, data);
  },
  deleteFeeds: async (id) => {
    await deleteFeed(id);
  },
  fetchFeedById: async (id) => {
    const allData = await getFeedById(id);
    set({ feeds: allData?.data || [] });
  }
}));

export { useFeedStore };
