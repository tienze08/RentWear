import { AxiosResponse } from "axios";

export interface User {
  id: string;
  username: string;
  email: string;
  role: "CUSTOMER" | "STORE" | "ADMIN";
  avatar?: string;
  storeInfo?: {
    storeName: string;
    address: string;
    phone: string;
  };
  phone?: string;
  address?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  rentalPrice: number;
  images: string[];
  storeId: string;
  category: string;
  size: string;
  available: boolean;
}

export interface Store {
  id: string;
  storeName: string;
  description: string;
  logoUrl: string;
  featured: boolean;
}

export interface Rental {
  id: string;
  productId: string;
  product: Product;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: "active" | "completed" | "cancelled";
}

export interface ChangePasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UpdateUserFormData {
  username: string;
  email: string;
  phone?: string;
  address?: string;
  avatar?: string;
}

export interface UserContextType {
  user: User | null;
  updateUser: (data: UpdateUserFormData) => Promise<void>;
  changePassword: (data: ChangePasswordFormData) => Promise<void>;
  updateAvatar: (file: File) => Promise<AxiosResponse>;
}
