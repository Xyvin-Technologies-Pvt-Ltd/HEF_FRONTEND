import { toast } from "react-toastify";
import axiosInstance from "./axiosintercepter";

export const courseDropDown = async () => {
  try {
    const response = await axiosInstance.get("/course/list");
    return response.data;
  } catch (error) {
    return null;
  }
};
export const addCourse = async (data) => {
    try {
      const response = await axiosInstance.post("/course", data);
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };