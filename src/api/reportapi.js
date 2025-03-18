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
export const getReportById = async (id) => {
  try {
    const response = await axiosInstance.get(`/report/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error caught:", error);
  }
};
