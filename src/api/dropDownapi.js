import axiosInstance from "./axiosintercepter";

export const getuser = async () => {
    try {
      const response = await axiosInstance.get("/user/listuid");
      return response.data;
    } catch (error) {
      return null;
    }
  };