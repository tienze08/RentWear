
import type { Product } from "@/lib/types";
import React, { createContext, useContext, useState, useEffect } from "react";


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

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<Array<{ product: Product; rentalDays: number }>>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart from localStorage", e);
      }
    }
  }, []);

  // Save cart to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Product, rentalDays: number) => {
    setItems((prev) => {
      // Check if product already exists in cart
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      
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
    setItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const isInCart = (productId: string) => {
    return items.some(item => item.product.id === productId);
  };

  const totalItems = items.length;
  
  const totalPrice = items.reduce((total, item) => {
    return total + (item.product.rentalPrice * item.rentalDays);
  }, 0);

  return (
    <CartContext.Provider value={{ 
      items, 
      addToCart, 
      removeFromCart, 
      clearCart, 
      isInCart, 
      totalItems,
      totalPrice
    }}>
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
