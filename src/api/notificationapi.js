import { toast } from "react-toastify";
import axiosInstance from "./axiosintercepter";

export const addNotification = async (data) => {
  try {
    const response = await axiosInstance.post("/notification", data);
    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
