import { create } from "zustand";
import { getBatch, getCollege, getMemberByBatch } from "../api/collegeapi";
import { getEvents } from "../api/eventapi";
import { getPromotion } from "../api/promotionapi";
import { getFeed, getFeedByUser } from "../api/feedapi";
import { getApproval } from "../api/approvalapi";
import { fetchRole } from "../api/roleManagementapi";
import { getAdmin } from "../api/adminapi";
import { getPayment } from "../api/paymentapi";
import { getNews } from "../api/newsapi";
import { getMember } from "../api/memberapi";
import { getGroup, getGroupById } from "../api/groupapi";
import { getReport } from "../api/reportapi";

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

  fetchColleges: async (filter) => {
    set({ loading: true });
    const allData = await getCollege(filter);
    set({
      lists: allData?.data || [],
      coursedetails:
        allData?.data?.map((college) => ({
          collegeId: college._id,
          courses: college.courseDetails || [],
        })) || [],
    });
    set({ totalCount: allData?.totalCount || 0 });

    set({ loading: false });
  },
  fetchEvent: async (filter) => {
    set({ loading: true });
    const allData = await getEvents(filter);
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
  fetchGroup: async (filter) => {
    set({ loading: true });
    const allData = await getGroup(filter);
    set({ lists: allData?.data || [] });
    set({ totalCount: allData?.totalCount || 0 });
    set({ loading: false });
  },
  fetchMembers: async (id, filter) => {
    set({ loading: true });
    const allData = await getGroupById(id, filter);
    set({ lists: allData?.data?.participantsData || [] });
    set({ totalCount: allData?.totalCount || 0 });
    set({ loading: false });
  },
  getMember: async (collegeId, courseId, batchId, filter) => {
    set({ loading: true });
    const allData = await getMemberByBatch(
      collegeId,
      courseId,
      batchId,
      filter
    );
    set({ lists: allData?.data || [] });
    set({ totalCount: allData?.totalCount || 0 });
    set({ loading: false });
  },
  fetchBatch: async (collegeId, courseId, filter) => {
    set({ loading: true });
    const allData = await getBatch(collegeId, courseId, filter);
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
}));

export { useListStore };
