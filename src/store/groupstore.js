import { create } from "zustand";
import {
  addGroup,
  deleteGroup,
  editGroup,
  getGroup,
  getGroupById,
  getSingleGroup,
} from "../api/groupapi";

const useGroupStore = create((set) => ({
  groups: [],
  group: [],singleGroup:[],
  fetchGroup: async (filter) => {
    const allData = await getGroup(filter);
    set({ groups: allData?.data || [] });
  },
  fetchMembers: async (id) => {
    const allData = await getGroupById(id);
    set({ group: allData?.data || [] });
  },
  fetchGroupById: async (id) => {
    const allData = await getSingleGroup(id);
    set({ singleGroup: allData?.data || [] });
  },
  addGroups: async (data) => {
    await addGroup(data);
  },
  deleteGroups: async (id) => {
    await deleteGroup(id);
  },
  updateGroup: async (id, data) => {
    await editGroup(id, data);
  },
}));

export { useGroupStore };
