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
    throw error.response.data;
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
export const getEventsDownload = async (filter = {}) => {
  try {
    const response = await axiosInstance.get(`/event/download`, {
      params: filter,
    });
    return response.data; // { headers, body }
  } catch (error) {
    throw error;
  }
};
export const getGuestsDownload = async (eventId) => {
  try {
    const response = await axiosInstance.get(`/event/${eventId}/download`);
    return response.data; // { headers, body }
  } catch (error) {
    throw error;
  }
};
export const getRsvpDownload = async (eventId, chapterId) => {
  try {
    const response = await axiosInstance.get(`/event/${eventId}/download-rsvp${chapterId ? `?chapterId=${chapterId}` : ''}`);
    return response.data; // { headers, body }
  } catch (error) {
    throw error;
  }
};


export const getEventRsvp = async (eventId, pageNo = 1, limit = 10,chapterId) => {
  try {
    const res = await axiosInstance.get(
      `/event/${eventId}/rsvp?pageNo=${pageNo}&limit=${limit}${chapterId ? `&chapterId=${chapterId}` : ''}`
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching RSVP:", error);
  }
};
export const removeEventRsvp = async (eventId, userId) => {
  try {
    const res = await axiosInstance.patch(`/event/single/${eventId}/remove-rsvp`, {
      userId, 
    });
    return res.data; 
  } catch (error) {
    console.error("Error removing RSVP:", error);
    throw error;
}
};