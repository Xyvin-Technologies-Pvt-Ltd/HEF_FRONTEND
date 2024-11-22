import { create } from "zustand";
import {
  addAdmin,
  getAdmin,
  getAdminById,
  getSingleAdmin,
} from "../api/adminapi";

const useAdminStore = create((set) => ({
  admins: [],
  singleAdmin: [],
  single: [],
  addAdmins: async (data) => {
    await addAdmin(data);
  },
  getAdmins: async () => {
    const response = await getAdmin();
    set({ admins: response.data || [] });
  },

  fetchAdminById: async () => {
    const response = await getAdminById();
    set({ singleAdmin: response.data || [] });
  },
  fetchSingleAdmin: async (id) => {
    const response = await getSingleAdmin(id);
    set({ single: response.data || [] });
  },
}));

export { useAdminStore };
