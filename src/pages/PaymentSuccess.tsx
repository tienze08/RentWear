import { Link, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { axiosInstance } from "@/lib/axiosInstance";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const paymentId = searchParams.get("paymentId");

  useEffect(() => {
    const updatePaymentStatus = async () => {
      if (paymentId) {
        try {
          await axiosInstance.put(`/payments/${paymentId}/status`, {
            status: "COMPLETED",
          });
        } catch (error) {
          console.error("Failed to update payment status:", error);
        }
      }
    };

    updatePaymentStatus();
  }, [paymentId]);

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 px-4 py-12 text-center">
        <CheckCircle className="h-24 w-24 text-green-500 mb-6" />
        <h1 className="text-4xl font-bold text-green-700 mb-2">
          Payment Successful!
        </h1>
        <p className="text-green-800 mb-6 text-lg">
          Your payment was successfully processed. Thank you for using Fasent!
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/my-rentals">
            <Button className="bg-green-600 text-white hover:bg-green-700 text-lg px-6 py-3 rounded-xl shadow">
              View My Rentals
            </Button>
          </Link>
          <Link to="/products">
            <Button
              variant="outline"
              className="text-green-700 border-green-400 text-lg px-6 py-3 rounded-xl"
            >
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default PaymentSuccess;
