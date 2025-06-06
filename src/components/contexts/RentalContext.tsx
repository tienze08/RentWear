import ApiConstants from "@/lib/api";
import { axiosInstance } from "@/lib/axiosInstance";
import type { Rental, RentalFormData } from "@/lib/types";
import React, { createContext, useContext, useState, useEffect } from "react";

interface RentalContextType {
  rentals: Rental[];
  createRental: (rental: RentalFormData) => void;
  cancelRental: (rentalId: string) => void;
  getRentalsByStatus: (status: Rental["status"]) => Rental[];
  totalItems: number;
  loading: boolean;
  fetchMyRentals: () => Promise<void>;
}

const RentalContext = createContext<RentalContextType | undefined>(undefined);

export const RentalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMyRentals();
  }, []);

  const fetchMyRentals = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(ApiConstants.GET_USER_RENTALS);
      setRentals(res.data);
    } finally {
      setLoading(false);
    }
  };
  const createRental = async (rental: RentalFormData) => {
    setLoading(true);
    try {
      const res = await axiosInstance.post(ApiConstants.RENTALS, rental);
      // Sau khi tạo thành công, cập nhật danh sách
      setRentals((prev) => [...prev, res.data.rental]);
      console.log("Created Rental: ", res.data.rental);
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
    console.log("Cancelling rental with ID:", rentalId);
    console.log("Current rentals before cancellation:", rentals);
    setRentals((prev) => prev.filter((rental) => rental._id !== rentalId));
    // Optionally, you can also make an API call to cancel the rental
    axiosInstance.patch(`${ApiConstants.RENTALS}/${rentalId}`, { status: "CANCELED" });
  };

  const getRentalsByStatus = (status: Rental["status"]) => {
    return rentals.filter((rental) => rental.status === status);
  };

  const totalItems = rentals.filter((r) => r.status === "PENDING").length;

  return (
    <RentalContext.Provider
      value={{
        rentals,
        createRental,
        cancelRental,
        getRentalsByStatus,
        totalItems,
        loading,
        fetchMyRentals,
      }}
    >
      {children}
    </RentalContext.Provider>
  );
};

export const useRental = () => {
  const context = useContext(RentalContext);
  if (context === undefined) {
    throw new Error("useRentals must be used within a RentalProvider");
  }
  return context;
};
