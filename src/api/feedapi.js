import { toast } from "react-toastify";
import axiosInstance from "./axiosintercepter";

export const getFeed = async (filter) => {
  try {
    const response = await axiosInstance.get(`/feeds/admin/list`, {
      params: filter,
    });
    return response.data;
  } catch (error) {
    return null;
  }
};

export const editFeed = async (action, id, data) => {
  try {
    const response = await axiosInstance.put(
      `/feeds/single/${action}/${id}`,
      data
    );
    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
export const deleteFeed = async (id) => {
  try {
    const response = await axiosInstance.delete(`/feeds/single/${id}`);

    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
export const getFeedById = async (id) => {
  try {
    const response = await axiosInstance.get(`/feeds/single/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
