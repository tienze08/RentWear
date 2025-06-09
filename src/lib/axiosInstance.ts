import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Quan trọng: gửi cookie lên server
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh-token")
    ) {      originalRequest._retry = true;
      try {
        // Gọi refresh token endpoint - backend sẽ lấy refresh token từ cookie
        const { data } = await axios.post(
          `${API_BASE_URL}/auth/refresh-token`,
          {}, // Empty body vì backend lấy refresh token từ cookie
          { withCredentials: true } // Quan trọng: gửi cookie
        );

        const { accessToken } = data;
        localStorage.setItem("accessToken", accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);      } catch (refreshError) {
        localStorage.removeItem("accessToken");
        // Không cần xóa refreshToken từ localStorage vì nó ở cookie
        // Chỉ redirect nếu không phải đang ở trang login/register
        const currentPath = window.location.pathname;
        if (currentPath !== "/login" && currentPath !== "/register") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
