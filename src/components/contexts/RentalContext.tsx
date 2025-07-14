import ApiConstants from "@/lib/api";
import axiosInstance from "@/lib/axiosInstance";
import type { Rental, RentalFormData } from "@/lib/types";
import React, { createContext, useState, useEffect } from "react";

interface RentalWithCancelInfo extends Rental {
  canCancel?: boolean;
  cancelReason?: string;
}

interface RentalContextType {
  rentals: RentalWithCancelInfo[];
  createRental: (rental: RentalFormData) => Promise<{ rental: Rental }>;
  cancelRental: (rentalId: string) => Promise<boolean>;
  getRentalsByStatus: (status: Rental["status"]) => RentalWithCancelInfo[];
  totalItems: number;
  loading: boolean;
  fetchMyRentals: (status?: string) => Promise<void>;
  refreshRentals: () => Promise<void>;
}

const RentalContext = createContext<RentalContextType | undefined>(undefined);

export { RentalContext };

export const RentalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [rentals, setRentals] = useState<RentalWithCancelInfo[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMyRentals();
  }, []);

  const fetchMyRentals = async (status?: string) => {
    setLoading(true);
    try {
      const params = status ? `?status=${status}` : '';
      const res = await axiosInstance.get(`${ApiConstants.GET_USER_RENTALS}${params}`);
      setRentals(res.data);
    } catch (error) {
      console.error('Failed to fetch rentals:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshRentals = async () => {
    await fetchMyRentals();
  };

  const createRental = async (rental: RentalFormData) => {
    setLoading(true);
    try {
      const res = await axiosInstance.post(ApiConstants.RENTALS, rental);
      // Sau khi tạo thành công, refresh danh sách
      await fetchMyRentals();
      console.log("Created Rental: ", res.data.rental);
      return res.data;
    } catch (error) {
      console.error('Failed to create rental:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const cancelRental = async (rentalId: string): Promise<boolean> => {
    try {
      setLoading(true);
      await axiosInstance.patch(`${ApiConstants.RENTALS}/${rentalId}/cancel`);
      
      // Cập nhật local state
      setRentals((prev) => 
        prev.map((rental) => 
          rental._id === rentalId 
            ? { ...rental, status: "CANCELED" as const, canCancel: false }
            : rental
        )
      );
      
      return true;
    } catch (error: unknown) {
      console.error('Failed to cancel rental:', error);
      // Throw error với message để component xử lý
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to cancel rental'
        : 'Failed to cancel rental';
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
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
        refreshRentals,
      }}
    >
      {children}
    </RentalContext.Provider>
  );
};

export default RentalProvider;
