import { create } from "zustand";
import { addAdmin, getAdmin, getAdminById } from "../api/adminapi";

const useAdminStore = create((set) => ({
  admins: [],
  singleAdmin: [],
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
  //   updateRole:async(id,data)=>{
  //     await editRole(id,data)
  //   }
}));

export { useAdminStore };
