import { toast } from "react-toastify";
import axiosInstance from "./axiosintercepter";

export const getCategory = async (filter) => {
  try {
    const response = await axiosInstance.get(`/category`, {
      params: filter,
    });
    return response.data;
  } catch (error) {
    return null;
  }
};

export const addCategory = async (data) => {
  try {
    const response = await axiosInstance.post(`/category`, data);
    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getCategoryById = async (id) => {
  try {
    const response = await axiosInstance.get(`/category/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const editCategory = async (id, data) => {
  try {
    const response = await axiosInstance.put(`/category/${id}`, data);
    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const deleteCategory = async (id) => {
  try {
    const response = await axiosInstance.delete(`/category/${id}`);
    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const downloadCategory = async () => {
  try {
    const response = await axiosInstance.get(
      "/category/download-category",
      {
        responseType: "blob",
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getCategoryMembers = async (id, filter) => {
  try {
    const response = await axiosInstance.get(`/category/members/${id}`, {
      params: filter,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
