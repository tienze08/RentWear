// src/components/contexts/AuthContext.tsx
import { User } from "@/lib/types";
import React, { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { AxiosError } from "axios";
import ApiConstants from "@/lib/api";

interface AuthContextType {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<User | void>;
    logout: () => Promise<void>;
    register: (
        name: string,
        email: string,
        password: string,
        role: string,
        storeInfo?: { storeName: string; address: string; phone: string }
    ) => Promise<void>;
    handleGoogleCallback: (accessToken: string) => Promise<void>; // Thêm kiểu cho hàm handleGoogleCallback
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
                axiosInstance.defaults.headers.common[
                    "Authorization"
                ] = `Bearer ${accessToken}`;
            } catch (e) {
                console.error("Invalid stored user:", e);
                localStorage.removeItem("user");
                localStorage.removeItem("accessToken");
            }
        }
    }, []);
    const login = async (email: string, password: string) => {
        try {
            // 1. Gọi API login - backend sẽ set refresh token vào cookie
            const response = await axiosInstance.post(ApiConstants.LOGIN, {
                email,
                password,
            });

            const { accessToken } = response.data; // Không còn refreshToken trong response
            // 2. Chỉ lưu accessToken vào localStorage
            localStorage.setItem("accessToken", accessToken);
            axiosInstance.defaults.headers.common[
                "Authorization"
            ] = `Bearer ${accessToken}`;

            // 3. Lấy thông tin user từ /me
            const userRes = await axiosInstance.get(
                ApiConstants.GET_CURRENT_USER
            );
            const userData = userRes.data;
            setUser(userData);
            setIsAuthenticated(true);
            localStorage.setItem("user", JSON.stringify(userData));

            return userData;
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
            await axiosInstance.post(ApiConstants.REGISTER, {
                username: name,
                email,
                password,
                role,
                storeInfo,
            });
            // Không tự động login nữa, chờ xác thực email
        } catch (error) {
            if (error instanceof AxiosError && error.response) {
                throw new Error(
                    error.response.data.message || "Registration failed"
                );
            }
            throw new Error("Registration failed");
        }
    };
    const logout = async () => {
        try {
            // Gọi API /logout - backend sẽ xóa refresh token cookie
            await axiosInstance.post(ApiConstants.LOGOUT);
        } catch (err) {
            console.warn("Logout request error:", err);
        } finally {
            setUser(null);
            setIsAuthenticated(false);
            localStorage.removeItem("user");
            localStorage.removeItem("accessToken");
            delete axiosInstance.defaults.headers.common["Authorization"];
            if (window.location.pathname !== "/login") {
                window.location.href = "/login";
            }
        }
    };

    // Google login callback handler
    const handleGoogleCallback = async (accessToken: string) => {
        localStorage.setItem("accessToken", accessToken);
        axiosInstance.defaults.headers.common[
            "Authorization"
        ] = `Bearer ${accessToken}`;
        const userRes = await axiosInstance.get(ApiConstants.GET_CURRENT_USER);
        const userData = userRes.data;
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem("user", JSON.stringify(userData));
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
                handleGoogleCallback, // expose for Google login
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
