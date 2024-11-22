import { create } from "zustand";
import {
  createRole,
  deleteRole,
  editRole,
  fetchListofRoleById,
  fetchRole,
} from "../api/roleManagementapi";

const useRoleStore = create((set) => ({
  roles: [],
  singleRole: [],
  addRole: async (data) => {
    await createRole(data);
  },
  getRoles: async () => {
    const response = await fetchRole();
    set({ roles: response.data || [] });
  },

  getRoleById: async (id) => {
    const response = await fetchListofRoleById(id);
    set({ singleRole: response.data || [] });
  },
  updateRole: async (id, data) => {
    await editRole(id, data);
  },
  deleteRoles: async (id) => {
    await deleteRole(id);
  },
}));

export { useRoleStore };
