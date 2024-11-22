import { toast } from "react-toastify";
import axiosInstance from "./axiosintercepter";

export const getNews = async (filter) => {
  try {
    const response = await axiosInstance.get("/news/list",{
      params: filter,
    });
    return response.data;
  } catch (error) {
    return null;
  }
};

export const getNewsById = async (id) => {
  try {
    const response = await axiosInstance.get(`/news/single/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const editNews = async (id, data) => {
  try {
    const response = await axiosInstance.put(`/news/single/${id}`, data);
    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
export const addNews = async (data) => {
  try {
    const response = await axiosInstance.post("/news", data);
    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
export const deleteNews = async (id) => {
  try {
    const response = await axiosInstance.delete(`/news/single/${id}`);

    return response.data;
  } catch (error) {
    console.error(error.response.data.message);
  }
};
