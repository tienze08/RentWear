import React, { createContext, useContext } from "react";
import { User, UpdateUserFormData, ChangePasswordFormData } from "@/lib/types";
import { axiosInstance } from "@/lib/axiosInstance";
import { AxiosResponse, AxiosError } from "axios";
import ApiConstants from "@/lib/api";
import { toast } from "sonner";
import { useAuth } from "./AuthContext";

interface UserContextType {
  user: User | null;
  updateUser: (data: UpdateUserFormData) => Promise<void>;
  changePassword: (data: ChangePasswordFormData) => Promise<void>;
  updateAvatar: (file: File) => Promise<AxiosResponse>;
  changeInfo: (data: UpdateUserFormData) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, setUser } = useAuth();

  const updateUser = async (data: UpdateUserFormData) => {
    try {
      const response = await axiosInstance.put(ApiConstants.UPDATE_USER, data);
      if (response.status === 200) {
        setUser(response.data);
        localStorage.setItem("user", JSON.stringify(response.data));
        toast.success("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update profile. Please try again.");
      throw error;
    }
  };

  const changePassword = async (data: ChangePasswordFormData) => {
    try {
      const response = await axiosInstance.put(ApiConstants.CHANGE_PASSWORD, {
        oldPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      console.log(response);

      if (response.status === 200) {
        toast.success("Password changed successfully!");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      if (error instanceof AxiosError && error.response?.status === 401) {
        throw new Error("Current password is incorrect");
      }
      throw error;
    }
  };

  const updateAvatar = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const response = await axiosInstance.put(
        ApiConstants.UPDATE_AVATAR,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200) {
        setUser(response.data);
        localStorage.setItem("user", JSON.stringify(response.data));
        toast.success("Avatar updated successfully!");
        return response;
      }
    } catch (error) {
      console.error("Error updating avatar:", error);
      toast.error("Failed to update avatar. Please try again.");
      throw error;
    }
  };

  const changeInfo = async (data: UpdateUserFormData) => {
    try {
      const response = await axiosInstance.put(ApiConstants.UPDATE_USER, data);
      if (response.status === 200) {
        setUser(response.data);
        localStorage.setItem("user", JSON.stringify(response.data));
        toast.success("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Error changing info:", error);
      throw error;
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        updateUser,
        changePassword,
        updateAvatar: async (
          file: File
        ): Promise<
          AxiosResponse<{
            id: string;
            email: string;
            name: string;
            avatar?: string;
          }>
        > => {
          const response = await updateAvatar(file);
          if (!response) {
            throw new Error("Failed to update avatar");
          }
          return response;
        },
        changeInfo,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
