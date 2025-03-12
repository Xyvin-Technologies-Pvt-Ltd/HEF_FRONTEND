import { toast } from "react-toastify";
import axiosInstance from "./axiosintercepter";

export const getPayment = async (filter) => {
  try {
    const response = await axiosInstance.get(`/payment`, {
      params: filter,
    });
    return response.data;
  } catch (error) {
    return null;
  }
};
export const getSinglePayment = async (id) => {
  try {
    const response = await axiosInstance.get(`/payment/${id}`);
    return response.data;
  } catch (error) {
    return null;
  }
};

export const getSubById = async (id) => {
  try {
    const response = await axiosInstance.get(
      `/payment/parent-subscription/${id}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const deletePayment = async (id) => {
  try {
    const response = await axiosInstance.delete(`/payment/${id}`);

    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const editPaymentSub = async (id, data) => {
  try {
    const response = await axiosInstance.put(
      `/payment/parent-subscription/${id}`,
      data
    );
    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const patchPayment = async (id, data) => {
  try {
    const response = await axiosInstance.patch(`/payment/status/${id}`, data);
    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    toast.error(error.response?.data?.message || "An error occurred");
    throw error;
  }
};
export const addParentSub = async (data) => {
  try {
    const response = await axiosInstance.post(
      "/payment/parent-subscription",
      data
    );
    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
export const getParentSub = async () => {
  try {
    const response = await axiosInstance.get(`/payment/parent-subscription`);
    return response.data;
  } catch (error) {
    return null;
  }
};
export const getPaymentById = async (id) => {
    try {
      const response = await axiosInstance.get(`/payment/user/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  export const addPayment = async (data) => {
    try {
      const response = await axiosInstance.post("/payment", data);
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  };
  export const editPayment = async (id, data) => {
    try {
      const response = await axiosInstance.put(`/payment/update/${id}`, data);
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  };