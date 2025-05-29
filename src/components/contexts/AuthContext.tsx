// src/components/contexts/AuthContext.tsx
import { User } from "@/lib/types";
import React, { createContext, useContext, useState, useEffect } from "react";
import { axiosInstance } from "@/lib/axiosInstance";
import { AxiosError } from "axios";
import ApiConstants from "@/lib/api";

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    role: string,
    storeInfo?: { storeName: string; address: string; phone: string }
  ) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Khi mount, nếu localStorage có accessToken và user, set vào state
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken && storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        setIsAuthenticated(true);
        // Gắn header Authorization mặc định
        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
      } catch (e) {
        console.error("Invalid stored user:", e);
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // 1. Gọi API login (server sẽ set refreshToken vào cookie)
      const response = await axiosInstance.post(ApiConstants.LOGIN, {
        email,
        password,
      });

      const { accessToken } = response.data;
      // 2. Lưu accessToken vào localStorage
      localStorage.setItem("accessToken", accessToken);
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

      // 3. Lấy thông tin user từ /me
      const userRes = await axiosInstance.get(ApiConstants.GET_CURRENT_USER);
      const userData = userRes.data;
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(userData));
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        throw new Error(error.response.data.message || "Login failed");
      }
      throw new Error("Login failed");
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role: string,
    storeInfo?: { storeName: string; address: string; phone: string }
  ) => {
    try {
      // 1. Gọi API register (server set refreshToken vào cookie)
      const response = await axiosInstance.post(ApiConstants.REGISTER, {
        username: name, // chú ý backend nhận `username` (không phải `name`)
        email,
        password,
        role,
        storeInfo,
      });

      const { accessToken } = response.data;
      // 2. Lưu accessToken
      localStorage.setItem("accessToken", accessToken);
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

      // 3. Lấy user
      const userRes = await axiosInstance.get(ApiConstants.GET_CURRENT_USER);
      const userData = userRes.data;
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(userData));
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        throw new Error(error.response.data.message || "Registration failed");
      }
      throw new Error("Registration failed");
    }
  };

  const logout = async () => {
    try {
      // Gọi API /logout để server clear cookie
      await axiosInstance.post(ApiConstants.LOGOUT);
    } catch (err) {
      console.warn("Logout request error:", err);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      delete axiosInstance.defaults.headers.common["Authorization"];
      window.location.href = "/login";
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
