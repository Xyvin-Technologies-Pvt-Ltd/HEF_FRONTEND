import axios from "axios";
const baseURL =
  import.meta.env.VITE_APP_API_URL || "http://localhost:3005/api/v1/";
const axiosInstance = axios.create({
  baseURL: baseURL,
});
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("4ZbQwXtY8uVrN5mP7kL3JhF6");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
