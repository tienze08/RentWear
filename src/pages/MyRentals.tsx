import { useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { useRental } from "@/hooks/useRental";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CalendarDays, Clock, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Rental } from "@/lib/types";

interface RentalWithCancelInfo extends Rental {
  canCancel?: boolean;
  cancelReason?: string;
}

const MyRentals = () => {
  const { rentals, cancelRental, loading } = useRental();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("active");
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  
  const activeRentals = rentals.filter(
    (rental) => rental.status === "APPROVED"
  );
  const completedRentals = rentals.filter(
    (rental) => rental.status === "RETURNED"
  );
  const pendingRentals = rentals.filter(
    (rental) => rental.status === "PENDING"
  );
  const cancelledRentals = rentals.filter(
    (rental) => rental.status === "CANCELED"
  );

  const handleCancelRental = async (rentalId: string) => {
    try {
      setCancellingId(rentalId);
      await cancelRental(rentalId);
      toast({
        title: "Rental cancelled",
        description: "Your rental has been cancelled successfully.",
      });
    } catch (error) {
      toast({
        title: "Failed to cancel rental",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setCancellingId(null);
    }
  };

  const isRentalExpired = (rental: Rental) => {
    return new Date() > new Date(rental.rentalEnd);
  };

  const getRemainingTime = (rental: Rental) => {
    const now = new Date();
    const endDate = new Date(rental.rentalEnd);
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) return "Expired";
    if (diffDays === 1) return "1 day left";
    return `${diffDays} days left`;
  };

  const RentalCard = ({ rental }: { rental: RentalWithCancelInfo }) => {
    const expired = isRentalExpired(rental);
    const remainingTime = getRemainingTime(rental);
    
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row">
        <div className="w-full md:w-1/3 h-48 md:h-auto">
          <img
            src={rental.productId.images?.[0] || "/placeholder.svg"}
            alt={rental.productId.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-6 flex-grow">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between">
            <div>
              <Link
                to={`/products/${rental.productId._id}`}
                className="text-xl font-semibold text-fashion-DEFAULT hover:text-fashion-accent"
              >
                {rental.productId.name}
              </Link>
              <p className="text-fashion-muted text-sm mt-1">
                Size: {rental.productId.size}
              </p>
            </div>

            <div className="mt-4 md:mt-0 md:ml-4 flex flex-col items-end gap-2">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                rental.status === "APPROVED" 
                  ? expired 
                    ? "bg-red-100 text-red-800" 
                    : "bg-green-100 text-green-800"
                  : rental.status === "RETURNED" 
                    ? "bg-blue-100 text-blue-800"
                    : rental.status === "PENDING"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
              }`}>
                {rental.status === "APPROVED" && (expired ? "Expired" : "Active")}
                {rental.status === "RETURNED" && "Completed"}
                {rental.status === "PENDING" && "Pending"}
                {rental.status === "CANCELED" && "Cancelled"}
              </div>
              
              {rental.status === "APPROVED" && !expired && (
                <span className="text-sm text-gray-600">{remainingTime}</span>
              )}
            </div>
          </div>

          <div className="mt-4 flex items-center text-fashion-muted">
            <CalendarDays className="h-4 w-4 mr-2" />
            <span>
              {new Date(rental.rentalStart).toLocaleDateString()} to{" "}
              {new Date(rental.rentalEnd).toLocaleDateString()}
            </span>
          </div>

          <div className="mt-2 font-medium">
            Total: {rental.totalPrice?.toLocaleString() || 0} VNĐ
          </div>

          {/* Cancel button and warning */}
          {(rental.status === "APPROVED" || rental.status === "PENDING") && (
            <div className="mt-4 space-y-2">
              {rental.canCancel === false && rental.cancelReason && (
                <Alert className="border-yellow-200 bg-yellow-50">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-800">
                    {rental.cancelReason}
                  </AlertDescription>
                </Alert>
              )}
              
              {rental.canCancel !== false && (
                <Button
                  variant="outline"
                  className="text-red-500 border-red-500 hover:bg-red-50"
                  onClick={() => handleCancelRental(rental._id)}
                  disabled={cancellingId === rental._id}
                >
                  {cancellingId === rental._id ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Cancelling...
                    </>
                  ) : (
                    "Cancel Rental"
                  )}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-fashion-DEFAULT mb-8">
          My Rentals
        </h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 bg-gray-100">
            <TabsTrigger
              value="pending"
              className="data-[state=active]:bg-blue-400 data-[state=active]:text-white"
            >
              Pending ({pendingRentals.length})
            </TabsTrigger>
            <TabsTrigger
              value="active"
              className="data-[state=active]:bg-blue-400 data-[state=active]:text-white"
            >
              Active ({activeRentals.length})
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="data-[state=active]:bg-blue-400 data-[state=active]:text-white"
            >
              Completed ({completedRentals.length})
            </TabsTrigger>
            <TabsTrigger
              value="cancelled"
              className="data-[state=active]:bg-blue-400 data-[state=active]:text-white"
            >
              Cancelled ({cancelledRentals.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-0">
            {pendingRentals.length > 0 ? (
              <div className="space-y-6">
                {pendingRentals.map((rental) => (
                  <RentalCard key={rental._id} rental={rental} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-fashion-DEFAULT mb-4">
                  No pending rentals
                </h2>
                <p className="text-fashion-muted mb-8">
                  You don't have any pending rentals at the moment.
                </p>
                <Link
                  to="/products"
                  className="px-6 py-2 bg-fashion-accent text-white rounded-lg hover:bg-fashion-accent/90 transition inline-block"
                >
                  Browse Products
                </Link>
              </div>
            )}
          </TabsContent>

          <TabsContent value="pending" className="mt-0">
            {pendingRentals.length > 0 ? (
              <div className="space-y-6">
                {pendingRentals.map((rental: RentalWithCancelInfo) => (
                  <RentalCard key={rental._id} rental={rental} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-fashion-DEFAULT mb-4">
                  No pending rentals
                </h2>
                <p className="text-fashion-muted mb-8">
                  You don't have any pending rentals at the moment.
                </p>
                <Link
                  to="/products"
                  className="px-6 py-2 bg-fashion-accent text-white rounded-lg hover:bg-fashion-accent/90 transition inline-block"
                >
                  Browse Products
                </Link>
              </div>
            )}
          </TabsContent>

          <TabsContent value="active" className="mt-0">
            {activeRentals.length > 0 ? (
              <div className="space-y-6">
                {activeRentals.map((rental: RentalWithCancelInfo) => (
                  <RentalCard key={rental._id} rental={rental} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-fashion-DEFAULT mb-4">
                  No active rentals
                </h2>
                <p className="text-fashion-muted mb-8">
                  You don't have any active rentals at the moment.
                </p>
                <Link
                  to="/products"
                  className="px-6 py-2 bg-fashion-accent text-white rounded-lg hover:bg-fashion-accent/90 transition inline-block"
                >
                  Browse Products
                </Link>
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed" className="mt-0">
            {completedRentals.length > 0 ? (
              <div className="space-y-6">
                {completedRentals.map((rental: RentalWithCancelInfo) => (
                  <RentalCard key={rental._id} rental={rental} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-fashion-DEFAULT mb-4">
                  No completed rentals
                </h2>
                <p className="text-fashion-muted mb-8">
                  You don't have any completed rentals yet.
                </p>
                <Link
                  to="/products"
                  className="px-6 py-2 bg-fashion-accent text-white rounded-lg hover:bg-fashion-accent/90 transition inline-block"
                >
                  Browse Products
                </Link>
              </div>
            )}
          </TabsContent>

          <TabsContent value="cancelled" className="mt-0">
            {cancelledRentals.length > 0 ? (
              <div className="space-y-6">
                {cancelledRentals.map((rental: RentalWithCancelInfo) => (
                  <RentalCard key={rental._id} rental={rental} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-fashion-DEFAULT mb-4">
                  No cancelled rentals
                </h2>
                <p className="text-fashion-muted mb-8">
                  You don't have any cancelled rentals.
                </p>
                <Link
                  to="/products"
                  className="px-6 py-2 bg-fashion-accent text-white rounded-lg hover:bg-fashion-accent/90 transition inline-block"
                >
                  Browse Products
                </Link>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default MyRentals;
