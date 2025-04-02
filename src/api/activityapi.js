import { toast } from "react-toastify";
import axiosInstance from "./axiosintercepter";

export const getActivities = async (filter) => {
  try {
    const response = await axiosInstance.get("/analytic", {
      params: filter,
    });
    return response.data;
  } catch (error) {
    console.error("Error caught:", error);
  }
};
export const createActivity = async (data) => {
  try {
    const response = await axiosInstance.post("/analytic", data);
    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
export const deleteActivity = async (id) => {
  try {
    const response = await axiosInstance.delete(`/analytic/${id}`);

    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
export const getBusinessDwld = async (filter) => {
  try {
    const response = await axiosInstance.get(`/analytic/download`, {
      params: filter,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};