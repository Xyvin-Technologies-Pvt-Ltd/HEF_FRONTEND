import { toast } from "react-toastify";
import axiosInstance from "./axiosintercepter";

export const createRole = async (data) => {
  try {
    const response = await axiosInstance.post("/role", data);
    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
export const fetchRole = async (filter) => {
  try {
    const response = await axiosInstance.get("/role/list", {
      params: filter,
    });
    return response.data;
  } catch (error) {
    console.error(error.response.data.message);
  }
};
export const fetchListofRoleById = async (id) => {
  try {
    const response = await axiosInstance.get(`/role/single/${id}`);
    return response.data;
  } catch (error) {
    console.error(error.response.data.message);
  }
};
export const editRole = async (id, data) => {
  try {
    const response = await axiosInstance.put(`/role/single/${id}`, data);
    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
export const deleteRole = async (id) => {
  try {
    const response = await axiosInstance.delete(`/role/single/${id}`);
    return response.data;
  } catch (error) {
    console.error(error.response.data.message);
  }
};
