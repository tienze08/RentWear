import axios from "axios";
import { BASE_URL } from "./api";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
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
    ) {
      originalRequest._retry = true;
      try {
        // Gọi refresh token endpoint - backend sẽ lấy refresh token từ cookie
        const { data } = await axios.post(
          `${BASE_URL}/auth/refresh-token`,
          {}, // Empty body vì backend lấy refresh token từ cookie
          { withCredentials: true } // Quan trọng: gửi cookie
        );

        const { accessToken } = data;
        localStorage.setItem("accessToken", accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("accessToken");
        // Không cần xóa refreshToken từ localStorage vì nó ở cookie
        // Chỉ redirect nếu không phải đang ở trang login/register hoặc các route public
        const currentPath = window.location.pathname;
        const publicRoutes = ["/login", "/register", "/", "/about", "/contact"];
        if (!publicRoutes.includes(currentPath)) {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
