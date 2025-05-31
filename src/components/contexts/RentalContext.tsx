
import ApiConstants from "@/lib/api";
import { axiosInstance } from "@/lib/axiosInstance";
import type { Rental } from "@/lib/types";
import React, { createContext, useContext, useState, useEffect } from "react";


interface RentalContextType {
  rentals: Rental[];
  createRental: (rental: Rental) => void;
  cancelRental: (rentalId: string) => void;
  getRentalsByStatus: (status: Rental['status']) => Rental[];
}

const RentalContext = createContext<RentalContextType | undefined>(undefined);

export const RentalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(false);

  // Load rentals from localStorage on mount
  const fetchMyRentals = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(ApiConstants.GET_USER_RENTALS);
      setRentals(res.data);
      console.log("Rentals : ", rentals)
    } finally {
      setLoading(false);
    }
  };

  // Save rentals to localStorage when it changes
  useEffect(() => {
    fetchMyRentals();
  }, [rentals]);

  const createRental = async (rental : Rental) => {
    setLoading(true);
    try {
      const res = await axiosInstance.post(ApiConstants.RENTALS, rental);
      // Sau khi tạo thành công, cập nhật danh sách
      setRentals((prev) => [...prev, res.data.rental]);
      return res.data;
    } finally {
      setLoading(false);
    }
  };

  // // Cập nhật trạng thái đơn thuê
  // const updateRentalStatus = async (rentalId, status) => {
  //   setLoading(true);
  //   try {
  //     const res = await axiosInstance.patch(`/rentals/${rentalId}/status`, { status });
  //     setRentals((prev) =>
  //       prev.map((r) => (r._id === rentalId ? { ...r, status: res.data.status } : r))
  //     );
  //     return res.data;
  //   } finally {
  //     setLoading(false);
  //   }
  // };


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
      createRental, 
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
