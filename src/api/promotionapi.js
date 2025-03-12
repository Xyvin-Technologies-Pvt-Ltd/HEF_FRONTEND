import { toast } from "react-toastify";
import axiosInstance from "./axiosintercepter";

export const getPromotion = async (filter) => {
  try {
    const response = await axiosInstance.get(`/promotion/list`, {
      params: filter,
    });
    return response.data;
  } catch (error) {
    return null;
  }
};

export const addPromotion = async (data) => {
  try {
    const response = await axiosInstance.post("/promotion", data);
    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
export const getPromotionById = async (id) => {
  try {
    const response = await axiosInstance.get(`/promotion/single/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const deletePromotion = async (id) => {
  try {
    const response = await axiosInstance.delete(`/promotion/single/${id}`);

    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
export const editPromotion = async (id, data) => {
  try {
    const response = await axiosInstance.put(`/promotion/single/${id}`, data);
    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
