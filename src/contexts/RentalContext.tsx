
import type { Rental } from "@/lib/types";
import React, { createContext, useContext, useState, useEffect } from "react";


interface RentalContextType {
  rentals: Rental[];
  addRental: (rental: Rental) => void;
  cancelRental: (rentalId: string) => void;
  getRentalsByStatus: (status: Rental['status']) => Rental[];
}

const RentalContext = createContext<RentalContextType | undefined>(undefined);

export const RentalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [rentals, setRentals] = useState<Rental[]>([]);

  // Load rentals from localStorage on mount
  useEffect(() => {
    const savedRentals = localStorage.getItem("rentals");
    if (savedRentals) {
      try {
        setRentals(JSON.parse(savedRentals));
      } catch (e) {
        console.error("Failed to parse rentals from localStorage", e);
      }
    }
  }, []);

  // Save rentals to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("rentals", JSON.stringify(rentals));
  }, [rentals]);

  const addRental = (rental: Rental) => {
    setRentals(prev => [...prev, rental]);
  };

  const cancelRental = (rentalId: string) => {
    setRentals(prev => prev.map(rental => 
      rental.id === rentalId 
        ? { ...rental, status: 'cancelled' as const } 
        : rental
    ));
  };

  const getRentalsByStatus = (status: Rental['status']) => {
    return rentals.filter(rental => rental.status === status);
  };

  return (
    <RentalContext.Provider value={{ 
      rentals, 
      addRental, 
      cancelRental, 
      getRentalsByStatus,
    }}>
      {children}
    </RentalContext.Provider>
  );
};

export const useRentals = () => {
  const context = useContext(RentalContext);
  if (context === undefined) {
    throw new Error("useRentals must be used within a RentalProvider");
  }
  return context;
};
