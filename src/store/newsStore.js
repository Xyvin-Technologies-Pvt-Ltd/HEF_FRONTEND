import { create } from "zustand";
import { addNews, deleteNews, editNews, getNews, getNewsById } from "../api/newsapi";

const useNewsStore = create((set) => ({
  news: [],
  singleNews: [],
  fetchNews: async () => {
    const allData = await getNews();
    set({ news: allData?.data || [] });
  },

  addNewses: async (data) => {
    await addNews(data);
  },
  updateNews: async (id, data) => {
    await editNews(id, data);
  },
  fetchNewsById: async (id) => {
    const allData = await getNewsById(id);

    set({ singleNews: allData?.data });
  },
  deleteNews: async (id) => {
    await deleteNews(id);
  },
}));

export { useNewsStore };
