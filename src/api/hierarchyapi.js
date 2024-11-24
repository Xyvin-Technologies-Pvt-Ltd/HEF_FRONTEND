import { toast } from "react-toastify";
import axiosInstance from "./axiosintercepter";

export const createState = async (data) => {
  try {
    const response = await axiosInstance.post("/hierarchy/state", data);
    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
export const createZone = async (data) => {
  try {
    const response = await axiosInstance.post("/hierarchy/zone", data);
    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    throw error.response.data;
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
export const createDistrict = async (data) => {
  try {
    const response = await axiosInstance.post("/hierarchy/district", data);
    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const createChapter = async (data) => {
  try {
    const response = await axiosInstance.post("/hierarchy/chapter", data);
    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    throw error.response.data;
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
