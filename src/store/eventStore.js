import { create } from "zustand";
import { createEvent, deleteEventById, getEventById, updateEventById } from "../api/eventapi";

const useEventStore = create((set) => ({
  events: [],
  event: [],
  loading: false,

  fetchEventById: async (id) => {
    set({ loading: true });
    const allData = await getEventById(id);
    set({ event: allData?.data || [] });
    set({ loading: false });
  },
  addEvent: async (data) => {
    await createEvent(data);
  },

  deleteEvent: async (id) => {
    await deleteEventById(id);
  },
  updateEvent: async (id, data) => {
    await updateEventById(id, data);
  },
}));

export { useEventStore };
