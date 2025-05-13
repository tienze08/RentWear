
export interface Product {
  id: string;
  name: string;
  description: string;
  rentalPrice: number;
  imageUrl: string;
  shopId: string;
  category: string;
  size: string;
  available: boolean;
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
  product: Product;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: 'active' | 'completed' | 'cancelled';
}
