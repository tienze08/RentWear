import type { Product } from "@/lib/types";
import React, { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "@/lib/axiosInstance";

interface CartContextType {
  items: Array<{ product: Product; rentalDays: number }>;
  addToCart: (product: Product, rentalDays: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  isInCart: (productId: string) => boolean;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [items, setItems] = useState<
    Array<{ product: Product; rentalDays: number }>
  >([]);

  // Fetch cart items
  // useEffect(() => {
  //   const fetchRentalsCart = async () => {
  //     try {
  //       const response = await axiosInstance.get("/rentals/user/me");
  //       const rentals = response.data;
  //       if (Array.isArray(rentals)) {
  //         const cartItems = rentals.map((rental: any) => ({
  //           product: rental.productId,
  //           rentalDays: rental.rentalEnd - rental.rentalStart,
  //         }));
  //         setItems(cartItems);
  //       } else {
  //         console.error("Invalid rentals data format:", rentals);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching rentals cart:", error);
  //     }
  //   };

  //   fetchRentalsCart();
  // }, []);

  const addToCart = (product: Product, rentalDays: number) => {
    setItems((prev) => {
      // Check if product already exists in cart
      const existingIndex = prev.findIndex(
        (item) => item.product._id === product._id
      );

      if (existingIndex >= 0) {
        // Replace the existing item with updated rental days
        const updated = [...prev];
        updated[existingIndex] = { product, rentalDays };
        return updated;
      } else {
        // Add new item
        return [...prev, { product, rentalDays }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.product._id !== productId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const isInCart = (productId: string) => {
    return items.some((item) => item.product._id === productId);
  };

  const totalItems = items.length;

  const totalPrice = items.reduce((total, item) => {
    return total + item.product.rentalPrice * item.rentalDays;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        clearCart,
        isInCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
