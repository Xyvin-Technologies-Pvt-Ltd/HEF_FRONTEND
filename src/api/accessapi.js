import { toast } from "react-toastify";
import axiosInstance from "./axiosintercepter";

export const getAccess = async (filter) => {
  try {
    const response = await axiosInstance.get("/useraccess", {
      params: filter,
    });
    return response.data;
  } catch (error) {
    console.error("Error caught:", error);
  }
};
export const updateAccess = async (id, data) => {
  try {
    const response = await axiosInstance.put(`/useraccess/${id}`, data);
    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
