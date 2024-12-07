import { toast } from "react-toastify";
import axiosInstance from "./axiosintercepter";

export const getApproval = async (filter) => {
  try {
    const response = await axiosInstance.get("/product/admin", {
      params: filter,
    });
    return response.data;
  } catch (error) {
    return null;
  }
};
export const editProduct = async (id, data) => {
  try {
    const response = await axiosInstance.put(`/product/single/${id}`, data);
    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
export const getFeedByUser = async (id,filter) => {
  try {
    const response = await axiosInstance.get(`/feeds/user/${id}`,{
      params: filter,
    });
    return response.data;
  } catch (error) {
    return null;
  }
};