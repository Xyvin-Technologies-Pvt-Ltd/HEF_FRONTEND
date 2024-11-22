import { toast } from "react-toastify";
import axiosInstance from "./axiosintercepter";

export const collegeDropDown = async () => {
  try {
    const response = await axiosInstance.get("/college/dropdown");
    return response.data;
  } catch (error) {
    return null;
  }
};
export const getCollege = async (filter) => {
  try {
    const response = await axiosInstance.get(`/college/list`, {
      params: filter,
    });
    return response.data;
  } catch (error) {
    return null;
  }
};
export const addCollege = async (data) => {
  try {
    const response = await axiosInstance.post("/college", data);
    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
export const getCollegeById = async (id) => {
  try {
    const response = await axiosInstance.get(`/college/single/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const deleteCollege = async (id) => {
  try {
    const response = await axiosInstance.delete(`/college/single/${id}`);

    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
export const editCollege = async (id, data) => {
  try {
    const response = await axiosInstance.put(`/college/single/${id}`, data);
    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
export const getBatch = async (collegeId, courseId,filter) => {
  try {
    const response = await axiosInstance.get(
      `/college/${collegeId}/course/${courseId}`,{
        params: filter,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getMemberByBatch = async (collegeId, courseId, batchId,filter) => {
  try {
    const response = await axiosInstance.get(
      `/college/${collegeId}/course/${courseId}/batch/${batchId}`,{
        params: filter,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const addCollegeBulk = async (data) => {
  try {
    console.log(data);

    const response = await axiosInstance.post(
      "/college/bulk",
      data
    );
    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};