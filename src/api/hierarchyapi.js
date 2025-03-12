import { toast } from "react-toastify";
import axiosInstance from "./axiosintercepter";

export const createLevel = async (type, data) => {
  try {
    const response = await axiosInstance.post(`/hierarchy/level/${type}`, data);
    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
export const getLevelById = async (type, filter) => {
  try {
    const response = await axiosInstance.get(`/hierarchy/level/${type}`, {
      params: filter,
    });

    return response.data;
  } catch (error) {
    console.error("Error caught:", error);
  }
};

export const getAllLevel = async (type, filter) => {
  try {
    const response = await axiosInstance.get(`/hierarchy/list/${type}`, {
      params: filter,
    });
    return response.data;
  } catch (error) {
    return null;
  }
};

export const getLevels = async (id, type, filter) => {
  try {
    const response = await axiosInstance.get(
      `/hierarchy/levels/${id}/${type}`,
      {
        params: filter,
      }
    );
    return response.data;
  } catch (error) {
    return null;
  }
};
export const editLevel = async (type, data, filter) => {
  try {
    const response = await axiosInstance.put(`/hierarchy/level/${type}`, data, {
      params: filter,
    });
    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
export const deleteLevel = async (type, filter) => {
  try {
    const response = await axiosInstance.delete(`/hierarchy/level/${type}`, {
      params: filter,
    });
    return response.data;
  } catch (error) {
    throw error.response.data;

  }
};
export const getchapterList = async () => {
  try {
    const response = await axiosInstance.get(`/hierarchy/chapter/list`);
    return response.data;
  } catch (error) {
    return null;
  }
};
