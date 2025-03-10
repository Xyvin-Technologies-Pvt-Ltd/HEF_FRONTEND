import { create } from "zustand";
import { addNotification, getNotificationById } from "../api/notificationapi";

const useNotificationStore = create((set) => ({
  notification: [],
  addNotifications: async (data) => {
    await addNotification(data);
  },
  fetchNotificationById: async (id) => {
    const allData = await getNotificationById(id);
    set({ notification: allData?.data || [] });
  },
}));

export { useNotificationStore };
