import axiosInstance from "./axiosintercepter";

export const getReport = async (filter) => {
  try {
    const response = await axiosInstance.get("/report", {
      params: filter,
    });
    return response.data;
  } catch (error) {
    return null;
  }
};


  
