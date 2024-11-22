import { toast } from "react-toastify";
import axiosInstance from "./axiosintercepter";

export const getApproval = async (filter) => {
  try {
    const response = await axiosInstance.get("/admin/approvals", {
      params: filter,
    });
    return response.data;
  } catch (error) {
    return null;
  }
};
export const editApproval = async (id, data) => {
  try {
    const response = await axiosInstance.put(`/admin/approval/${id}`, data);
    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
