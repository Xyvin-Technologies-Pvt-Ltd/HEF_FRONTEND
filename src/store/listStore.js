import { create } from "zustand";
import { getEvents } from "../api/eventapi";
import { getPromotion } from "../api/promotionapi";
import { getFeed } from "../api/feedapi";
import { getApproval, getFeedByUser } from "../api/productapi";
import { fetchRole } from "../api/roleManagementapi";
import { getAdmin, getAdminActivity } from "../api/adminapi";
import { getNews } from "../api/newsapi";
import { getMember } from "../api/memberapi";
import { getReport } from "../api/reportapi";
import { getAllLevel } from "../api/hierarchyapi";
import { getActivities } from "../api/activityapi";
import { getParentSub, getPayment } from "../api/paymentapi";
import { getNotification } from "../api/notificationapi";
import { getGroup } from "../api/groupapi";

const useListStore = create((set, get) => ({
  lists: [],
  totalCount: 0,
  rowPerSize: 10,
  pageNo: 1,
  loading: false,
  coursedetails: [],
  pageInitial: (value) => {
    set({ pageNo: value });
  },
  pageInc: () => {
    const { pageNo, totalCount, rowPerSize } = get();
    const totalPages = Math.ceil(totalCount / rowPerSize);

    if (pageNo < totalPages) {
      set({ pageNo: pageNo + 1 });
    }
  },
  pageDec: () => {
    const { pageNo } = get();
    if (pageNo > 1) {
      set({ pageNo: pageNo - 1 });
    }
  },
  rowChange: (value) => {
    set({ rowPerSize: value });
  },

  fetchEvent: async (filter) => {
    set({ loading: true });
    const allData = await getEvents(filter);
    set({ lists: allData?.data || [] });
    set({ totalCount: allData?.totalCount || 0 });
    set({ loading: false });
  },
  fetchActivity: async (filter) => {
    set({ loading: true });
    const allData = await getActivities(filter);
    set({ lists: allData?.data || [] });
    set({ totalCount: allData?.totalCount || 0 });
    set({ loading: false });
  },
  getActivity: async (filter) => {
    set({ loading: true });
    const allData = await getAdminActivity(filter);
    set({ lists: allData?.data || [] });
    set({ totalCount: allData?.totalCount || 0 });
    set({ loading: false });
  },
  fetchFeedByUser: async (id, filter) => {
    set({ loading: true });
    const allData = await getFeedByUser(id, filter);
    set({ lists: allData?.data || [] });
    set({ totalCount: allData?.totalCount || 0 });
    set({ loading: false });
  },
  fetchPromotion: async (filter) => {
    set({ loading: true });
    const allData = await getPromotion(filter);
    set({ lists: allData?.data || [] });
    set({ totalCount: allData?.totalCount || 0 });
    set({ loading: false });
  },
  fetchFeed: async (filter) => {
    set({ loading: true });
    const allData = await getFeed(filter);
    set({ lists: allData?.data || [] });
    set({ totalCount: allData?.totalCount || 0 });
    set({ loading: false });
  },
  fetchNotification: async (filter) => {
    set({ loading: true });
    const allData = await getNotification(filter);
    set({ lists: allData?.data || [] });
    set({ totalCount: allData?.totalCount || 0 });
    set({ loading: false });
  },
  fetchApproval: async (filter) => {
    set({ loading: true });
    const allData = await getApproval(filter);
    set({ lists: allData?.data || [] });
    set({ totalCount: allData?.totalCount || 0 });
    set({ loading: false });
  },
  getRoles: async (filter) => {
    set({ loading: true });
    const allData = await fetchRole(filter);
    set({ lists: allData?.data || [] });
    set({ totalCount: allData?.totalCount || 0 });
    set({ loading: false });
  },
  getAdmins: async (filter) => {
    set({ loading: true });
    const allData = await getAdmin(filter);
    set({ lists: allData?.data || [] });
    set({ totalCount: allData?.totalCount || 0 });
    set({ loading: false });
  },
  fetchPayment: async (filter) => {
    set({ loading: true });
    const allData = await getPayment(filter);
    set({ lists: allData?.data || [] });
    set({ totalCount: allData?.totalCount || 0 });
    set({ loading: false });
  },
  fetchNews: async (filter) => {
    set({ loading: true });
    const allData = await getNews(filter);
    set({ lists: allData?.data || [] });
    set({ totalCount: allData?.totalCount || 0 });
    set({ loading: false });
  },
  fetchMember: async (filter) => {
    set({ loading: true });
    const allData = await getMember(filter);
    set({ lists: allData?.data || [] });
    set({ totalCount: allData?.totalCount || 0 });
    set({ loading: false });
  },
  fetchLevels: async (type, filter) => {
    set({ loading: true });
    const allData = await getAllLevel(type, filter);
    set({ lists: allData?.data || [] });
    set({ totalCount: allData?.totalCount || 0 });
    set({ loading: false });
  },

  fetchReport: async (filter) => {
    set({ loading: true });
    const allData = await getReport(filter);
    set({ lists: allData?.data || [] });
    set({ totalCount: allData?.totalCount || 0 });
    set({ loading: false });
  },
  fetchParentSub: async () => {
    set({ loading: true });
    const allData = await getParentSub();
    set({ lists: allData?.data || [] });
    set({ totalCount: allData?.totalCount || 0 });
    set({ loading: false });
  },

  fetchGroup: async (filter) => {
    set({ loading: true });
    const allData = await getGroup(filter);
    set({ lists: allData?.data || [] });
    set({ totalCount: allData?.totalCount || 0 });
    set({ loading: false });
  },
}));

export { useListStore };
