import ApiConstants from "@/lib/api";
import axiosInstance from "@/lib/axiosInstance";
import type { Rental, RentalFormData } from "@/lib/types";
import React, { createContext, useContext, useState, useEffect } from "react";

interface RentalContextType {
  rentals: Rental[];
  createRental: (rental: RentalFormData) => void;
  cancelRental: (rentalId: string) => Promise<void>;
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

  const cancelRental = async (rentalId: string) => {
    try {
      console.log("Cancelling rental with ID:", rentalId);
      console.log("Current rentals before cancellation:", rentals);

      // Gọi API cancel trước
      const response = await axiosInstance.patch(
        `${ApiConstants.RENTALS}/${rentalId}/cancel`
      );

      if (response.status === 200) {
        // Chỉ update state khi API thành công
        setRentals((prev) => prev.filter((rental) => rental?._id !== rentalId));
        console.log("Rental cancelled successfully:", response.data);
      }
    } catch (error: unknown) {
      console.error("Error cancelling rental:", error);
      // Có thể thêm notification hoặc toast ở đây
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      if (axiosError.response?.data?.message) {
        alert(`Cannot cancel rental: ${axiosError.response.data.message}`);
      } else {
        alert("Failed to cancel rental. Please try again.");
      }
    }
  };

  const getRentalsByStatus = (status: Rental["status"]) => {
    return rentals?.filter((rental) => rental?.status === status) || [];
  };

  const totalItems =
    rentals?.filter((r) => r?.status === "PENDING")?.length || 0;

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
