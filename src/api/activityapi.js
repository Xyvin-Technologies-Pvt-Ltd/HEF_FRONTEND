import axiosInstance from "./axiosintercepter";

export const getActivities = async (filter) => {
    try {
      const response = await axiosInstance.get("/analytic",{
        params: filter,
      });
      return response.data;
    } catch (error) {
      console.error("Error caught:", error);
    }
  };