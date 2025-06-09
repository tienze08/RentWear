import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/lib/axiosInstance";

const PaymentCancel = () => {
  const [searchParams] = useSearchParams();
  const orderCode = searchParams.get("orderCode");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cancelPayment = async () => {
      if (!orderCode) {
        setError("Missing order code");
        setLoading(false);
        return;
      }
      try {
        await axiosInstance.delete(
          `/payments/by-order-code?orderCode=${orderCode}`
        );
      } catch (err) {
        console.log(err);
        setError("Failed to cancel payment");
      } finally {
        setLoading(false);
      }
    };
    cancelPayment();
  }, [orderCode]);

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 px-4 py-12 text-center">
        <h1 className="text-4xl font-bold text-red-700 mb-2">
          Payment Cancelled
        </h1>
        {loading ? (
          <p className="text-red-800 mb-6 text-lg">
            Cancelling your payment...
          </p>
        ) : error ? (
          <p className="text-red-800 mb-6 text-lg">{error}</p>
        ) : (
          <p className="text-red-800 mb-6 text-lg">
            Your payment has been cancelled and removed from the system.
          </p>
        )}
        <Link to="/products">
          <Button
            variant="outline"
            className="text-red-700 border-red-400 text-lg px-6 py-3 rounded-xl mt-6"
          >
            Continue Shopping
          </Button>
        </Link>
      </div>
    </Layout>
  );
};

export default PaymentCancel;
