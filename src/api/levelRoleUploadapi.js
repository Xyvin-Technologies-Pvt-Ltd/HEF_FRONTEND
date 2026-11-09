import axiosInstance from "./axiosintercepter";

export const getLevelRoleUploads = async (filter) => {
  try {
    const response = await axiosInstance.get("/level-role-upload/admin", {
      params: filter,
    });
    return response.data;
  } catch (error) {
    return null;
  }
};

export const getLevelRoleUploadById = async (id) => {
  const response = await axiosInstance.get(`/level-role-upload/admin/${id}`);
  return response.data;
};

export const downloadLevelRoleUploadFile = async (id) => {
  const response = await axiosInstance.get(`/level-role-upload/admin/${id}/file`, {
    responseType: "blob",
  });
  return response;
};

export const deleteLevelRoleUpload = async (id) => {
  try {
    const response = await axiosInstance.delete(`/level-role-upload/admin/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
