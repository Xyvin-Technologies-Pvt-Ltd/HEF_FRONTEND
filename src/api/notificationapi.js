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
export const getNotification = async () => {
  try {
    const response = await axiosInstance.get("/notification");
    return response.data;
  } catch (error) {
    console.error("Error caught:", error);
  }
};
export const getNotificationById = async (id) => {
  try {
    const response = await axiosInstance.get(`/notification/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error caught:", error);
  }
};
