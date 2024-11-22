import axiosInstance from "./axiosintercepter";

export const getuser = async () => {
    try {
      const response = await axiosInstance.get("/admin/dropdown");
      return response.data;
    } catch (error) {
      return null;
    }
  };