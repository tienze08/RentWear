export interface Product {
  id: string;
  name: string;
  description: string;
  logoUrl: string;
  featured: boolean;
}

export interface Shop {
  id: string;
  name: string;
  description: string;
  logoUrl: string;
  featured: boolean;
}

export interface Rental {
  id: string;
  productId: string;
  userId: string;
  startDate: string;
  endDate: string;
  status: "active" | "completed" | "canceled";
}

