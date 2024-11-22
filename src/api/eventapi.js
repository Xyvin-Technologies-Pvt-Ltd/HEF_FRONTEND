import { toast } from "react-toastify";
import axiosInstance from "./axiosintercepter";

export const getEvents = async (filter) => {
  try {
    const response = await axiosInstance.get("/event/admin/list",{
      params: filter,
    });
    return response.data;
  } catch (error) {
    console.error("Error caught:", error);
  }
};

export const createEvent = async (eventData) => {
  try {
    const response = await axiosInstance.post("/event", eventData);
    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getEventById = async (id) => {
  try {
    const response = await axiosInstance.get(`/event/single/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error caught:", error);
  }
};

export const deleteEventById = async (id) => {
  try {
    const response = await axiosInstance.delete(`/event/single/${id}`);

    return response.data;
  } catch (error) {
    console.error("Error caught:", error);
  }
};

export const updateEventById = async (id, data) => {
  try {
    const response = await axiosInstance.put(`/event/single/${id}`, data);
    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
