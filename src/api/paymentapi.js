import axiosInstance from "./axiosintercepter";

export const getPayment = async (filter) => {
  try {
    const response = await axiosInstance.get("/payment/list", {
      params: filter,
    });
    return response.data;
  } catch (error) {
    return null;
  }
};
