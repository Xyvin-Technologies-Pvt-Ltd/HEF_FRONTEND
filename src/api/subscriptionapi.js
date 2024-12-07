import { toast } from "react-toastify";
import axiosInstance from "./axiosintercepter";

export const createSubscription = async (data) => {
    try {
      const response = await axiosInstance.post("/subscription",data);
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  };
  export const getSubscriptionById = async (id) => {
    try {
      const response = await axiosInstance.get(`/subscription/single/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error caught:", error);
    }
  };
  export const renewSubscription = async (id, data) => {
    try {
      const response = await axiosInstance.put(`/subscription/single/${id}`, data);
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  };
  export const getAllSubscription = async () => {
    try {
      const response = await axiosInstance.get("/subscription");
      return response.data;
    } catch (error) {
      return null;
    }
  };