import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true, // Quan trọng để gửi cookie (refreshToken)
  headers: {
    "Content-Type": "application/json",
  },
});

// Gắn accessToken vào mỗi request trước khi gửi
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Xử lý tự động làm mới token khi hết hạn
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const res = await axiosInstance.post("/auth/refresh-token");
        const newAccessToken = res.data.accessToken;
        localStorage.setItem("accessToken", newAccessToken);

        // Cập nhật token cho request gốc
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("accessToken");
        window.location.href = "/login"; // Redirect về trang login
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
