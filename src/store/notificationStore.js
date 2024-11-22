import { create } from "zustand";
import { addNotification } from "../api/notificationapi";

const useNotificationStore = create(() => ({
  addNotifications: async (data) => {
    await addNotification(data);
  },
}));

export { useNotificationStore };
