import { AxiosResponse } from "axios";

export interface User {
  _id: string;
  username: string;
  email: string;
  role: "CUSTOMER" | "STORE" | "ADMIN";
  status: "ACTIVE" | "INACTIVE" | "BLOCKED";
  avatar?: string;
  storeInfo?: {
    storeName: string;
    address: string;
    phone: string;
    logoUrl?: string;
  };
  phone?: string;
  address?: string;
}

export interface Product {
  _id: string;
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
  _id: string;
  storeName: string;
  description: string;
  logoUrl: string;
  featured: boolean;
  avatar ?: string;
}

export interface Rental {
  _id: string;
  productId: Product;
  customerId: User;
  storeId: Store;
  rentalStart: string;
  rentalEnd: string;
  totalPrice: number;
  depositPaid: boolean;
  status: "PENDING" | "APPROVED" | "CANCELED" | "RETURNED";
  product: {
    _id: string;
    name: string;
    images: string[];
    size: string;
  };
}

export interface RentalFormData {
  productId: string | undefined;
  customerId: string;
  storeId: string;
  rentalStart: string;
  rentalEnd: string;
  totalPrice: number;
  depositPaid: boolean;
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

export interface ReportPayload {
  _id: string;
  reporter: { username: string };
  reason: string;
  description: string;
  createdAt: string;
}
