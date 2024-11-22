import { toast } from "react-toastify";
import axiosInstance from "./axiosintercepter";

export const getMember = async (filter) => {
  try {
    const response = await axiosInstance.get(`/user/admin/list`, {
      params: filter,
    });
    return response.data;
  } catch (error) {
    return null;
  }
};
export const getSingleUser = async (id) => {
  try {
    const response = await axiosInstance.get(`/user/get/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const addMember = async (data) => {
  try {
    const response = await axiosInstance.post("/user/admin", data);
    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
export const getMemberById = async (id) => {
  try {
    const response = await axiosInstance.get(`/user/admin/single/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const deleteMember = async (id) => {
  try {
    const response = await axiosInstance.delete(`/user/admin/single/${id}`);

    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
export const editMember = async (id, data) => {
  try {
    const response = await axiosInstance.put(`/user/admin/single/${id}`, data);
    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const userBlock = async (id) => {
  try {
    const response = await axiosInstance.patch(`/user/admin/block-user/${id}`);
    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    toast.error(error.response.data.message);
  }
};
export const userUnBlock = async (id) => {
  try {
    const response = await axiosInstance.patch(`/user/admin/unblock-user/${id}`);
    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    toast.error(error.response.data.message);
  }
};
