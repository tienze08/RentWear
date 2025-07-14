import { useContext } from "react";
import { RentalContext } from "@/components/contexts/RentalContext";

export const useRental = () => {
  const context = useContext(RentalContext);
  if (context === undefined) {
    throw new Error("useRental must be used within a RentalProvider");
  }
  return context;
};
