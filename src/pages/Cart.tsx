import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { useRental } from "@/components/contexts/RentalContext";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Rental } from "@/lib/types";
import { axiosInstance } from "@/lib/axiosInstance";

const Cart = () => {
  const { rentals, cancelRental, fetchMyRentals } = useRental();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedRentalIds, setSelectedRentalIds] = useState<string[]>([]);

  useEffect(() => {
    fetchMyRentals();
  }, []);

  const rentalDays = (rental: Rental) => {
    const startDate = new Date(rental.rentalStart);
    const endDate = new Date(rental.rentalEnd);
    const days =
      Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      ) + 1;
    return days;
  };

  const toggleRentalSelection = (id: string) => {
    setSelectedRentalIds((prev) =>
      prev.includes(id) ? prev.filter((rid) => rid !== id) : [...prev, id]
    );
  };

  const selectedRentals = rentals.filter((r) =>
    selectedRentalIds.includes(r._id)
  );
  const totalPrice = selectedRentals.reduce((sum, r) => sum + r.totalPrice, 0);

  console.log("Rentals:", rentals);

  const handleCheckout = async () => {
    if (selectedRentalIds.length === 0) {
      toast({
        title: "No items selected",
        description: "Please select rentals to proceed.",
        variant: "destructive",
      });
      return;
    }
    setIsProcessing(true);

    try {
      const res = await axiosInstance.post("/payments/checkout", {
        rentalIds: selectedRentalIds,
      });
      window.location.href = res.data.paymentUrl;
    } catch (error) {
      console.log("Checkout error:", error);
      toast({ title: "Checkout error", variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-fashion-DEFAULT mb-8">
          Your Cart
        </h1>

        {rentals.length > 0 ? (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-fashion-DEFAULT">
                    Cart Items ({rentals.length})
                  </h2>
                </div>

                <ul className="divide-y divide-gray-200">
                  {rentals
                    .filter((r) => r.productId && r.productId.images)
                    .map((rental) => (
                      <li
                        key={rental._id}
                        className="p-6 flex flex-col sm:flex-row sm:items-center"
                      >
                        <div className="flex sm:items-center w-full">
                          <label className="flex items-center gap-3 w-full cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedRentalIds.includes(rental._id)}
                              onChange={() => toggleRentalSelection(rental._id)}
                              className="form-checkbox h-5 w-5 text-fashion-accent border-gray-300 rounded"
                            />

                            <div className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-md overflow-hidden">
                              <img
                                src={
                                  rental.productId && rental.productId.images
                                    ? rental.productId.images[0]
                                    : ""
                                }
                                alt={
                                  rental.productId && rental.productId.name
                                    ? rental.productId.name
                                    : ""
                                }
                                className="w-full h-full object-cover"
                              />
                            </div>

                            <div className="flex-grow ml-4">
                              <Link
                                to={`/products/${rental.productId?._id || ""}`}
                                className="text-lg font-medium text-fashion-DEFAULT hover:text-fashion-accent"
                              >
                                {rental.productId?.name || "Unknown"}
                              </Link>
                              <p className="text-fashion-muted text-sm mt-1">
                                Size: {rental.productId?.size || "N/A"}
                              </p>
                              <div className="mt-1 text-sm text-fashion-muted">
                                Rental Period:{" "}
                                <span className="font-medium">
                                  {rentalDays(rental)} days
                                </span>
                              </div>
                              <div className="mt-1 font-medium">
                                {rental.totalPrice.toFixed(2)} VNĐ
                              </div>
                            </div>
                          </label>

                          <button
                            onClick={() => cancelRental(rental._id)}
                            className="ml-4 text-fashion-muted hover:text-red-500 transition"
                            aria-label="Remove item"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                      </li>
                    ))}
                </ul>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h2 className="text-xl font-semibold text-fashion-DEFAULT mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-fashion-muted">Subtotal</span>
                    <span className="font-medium">
                      {totalPrice.toFixed(2)} VNĐ
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-fashion-muted">Processing Fee</span>
                    <span className="font-medium">
                      {(totalPrice * 0.1).toFixed(2)} VNĐ
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-4">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold">
                      {(totalPrice * 1.1).toFixed(2)} VNĐ
                    </span>
                  </div>
                </div>

                <Button
                  onClick={handleCheckout}
                  disabled={rentals.length === 0 || isProcessing}
                  className="w-full py-6 text-lg bg-fashion-accent hover:bg-fashion-accent/90"
                >
                  {isProcessing ? "Processing..." : "Checkout"}
                </Button>

                <p className="text-fashion-muted text-sm text-center mt-4">
                  By checking out, you agree to our Terms of Service and Rental
                  Policy.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-fashion-DEFAULT mb-4">
              Your cart is empty
            </h2>
            <p className="text-fashion-muted mb-8">
              Explore our collection and add items to your cart to get started.
            </p>
            <Link
              to="/products"
              className="px-8 py-3 bg-fashion-accent text-white font-semibold rounded-lg shadow-md hover:bg-fashion-accent/90 transition inline-block"
            >
              Browse Products
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Cart;
