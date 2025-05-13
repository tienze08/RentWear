
import { useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { useRentals } from "@/contexts/RentalContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Rental } from "@/types";
import { CalendarDays } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const MyRentals = () => {
  const { rentals, cancelRental } = useRentals();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("active");
  
  const activeRentals = rentals.filter(rental => rental.status === "active");
  const completedRentals = rentals.filter(rental => rental.status === "completed");
  const cancelledRentals = rentals.filter(rental => rental.status === "cancelled");

  const handleCancelRental = (rentalId: string) => {
    cancelRental(rentalId);
    toast({
      title: "Rental cancelled",
      description: "Your rental has been cancelled successfully.",
    });
  };

  const RentalCard = ({ rental }: { rental: Rental }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row">
      <div className="w-full md:w-1/3 h-48 md:h-auto">
        <img 
          src={rental.product.imageUrl} 
          alt={rental.product.name} 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="p-6 flex-grow">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between">
          <div>
            <Link 
              to={`/products/${rental.product.id}`}
              className="text-xl font-semibold text-fashion-DEFAULT hover:text-fashion-accent"
            >
              {rental.product.name}
            </Link>
            <p className="text-fashion-muted text-sm mt-1">Size: {rental.product.size}</p>
          </div>
          
          <div className="mt-4 md:mt-0 md:ml-4 flex items-center px-3 py-1 rounded-full bg-fashion-light text-sm font-medium">
            {rental.status === "active" && "Active"}
            {rental.status === "completed" && "Completed"}
            {rental.status === "cancelled" && "Cancelled"}
          </div>
        </div>
        
        <div className="mt-4 flex items-center text-fashion-muted">
          <CalendarDays className="h-4 w-4 mr-2" />
          <span>
            {rental.startDate} to {rental.endDate}
          </span>
        </div>
        
        <div className="mt-2 font-medium">
          Total: ${rental.totalPrice.toFixed(2)}
        </div>
        
        {rental.status === "active" && (
          <div className="mt-4">
            <Button 
              variant="outline" 
              className="text-red-500 border-red-500 hover:bg-red-50"
              onClick={() => handleCancelRental(rental.id)}
            >
              Cancel Rental
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-fashion-DEFAULT mb-8">My Rentals</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger 
              value="active" 
              className="data-[state=active]:bg-fashion-accent data-[state=active]:text-white"
            >
              Active ({activeRentals.length})
            </TabsTrigger>
            <TabsTrigger 
              value="completed"
              className="data-[state=active]:bg-fashion-accent data-[state=active]:text-white"
            >
              Completed ({completedRentals.length})
            </TabsTrigger>
            <TabsTrigger 
              value="cancelled"
              className="data-[state=active]:bg-fashion-accent data-[state=active]:text-white"
            >
              Cancelled ({cancelledRentals.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="active" className="mt-0">
            {activeRentals.length > 0 ? (
              <div className="space-y-6">
                {activeRentals.map(rental => (
                  <RentalCard key={rental.id} rental={rental} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-fashion-DEFAULT mb-4">No active rentals</h2>
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
                {completedRentals.map(rental => (
                  <RentalCard key={rental.id} rental={rental} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-fashion-DEFAULT mb-4">No completed rentals</h2>
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
                {cancelledRentals.map(rental => (
                  <RentalCard key={rental.id} rental={rental} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-fashion-DEFAULT mb-4">No cancelled rentals</h2>
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
