import { create } from "zustand";
import {
  addAdmin,
  deleteAdmin,
  editAdmin,
  getActivityById,
  getAdmin,
  getAdminActivity,
  getAdminById,
  getSingleAdmin,
} from "../api/adminapi";

const useAdminStore = create((set) => ({
  admins: [],
  singleAdmin: [],
  single: [],
  activity: [],
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
  updateAdmin: async (id, data) => {
    await editAdmin(id, data);
  },
  deleteAdmins: async (id) => {
    await deleteAdmin(id);
  },
  fetchAdminActivity: async (id) => {
    const response = await getActivityById(id);
    set({ activity: response.data || [] });
  },
}));

export { useAdminStore };
