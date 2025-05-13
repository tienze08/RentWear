
import { useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { useCart } from "@/contexts/CartContext";
import { useRentals } from "@/contexts/RentalContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { Rental } from "@/types";
import { useToast } from "@/hooks/use-toast";

const Cart = () => {
  const { items, removeFromCart, totalPrice, clearCart } = useCart();
  const { addRental } = useRentals();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = () => {
    if (items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Add some items to your cart before checking out.",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate checkout process
    setTimeout(() => {
      // Create rentals from cart items
      items.forEach(item => {
        const today = new Date();
        const endDate = new Date(today);
        endDate.setDate(today.getDate() + item.rentalDays);
        
        const rental: Rental = {
          id: `rental-${Date.now()}-${item.product.id}`,
          productId: item.product.id,
          product: item.product,
          startDate: today.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0],
          totalPrice: item.product.rentalPrice * item.rentalDays,
          status: 'active',
        };
        
        addRental(rental);
      });
      
      // Clear cart
      clearCart();
      
      // Show success message
      toast({
        title: "Checkout successful!",
        description: "Your items have been rented successfully.",
      });
      
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-fashion-DEFAULT mb-8">Your Cart</h1>
        
        {items.length > 0 ? (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-fashion-DEFAULT">Cart Items ({items.length})</h2>
                </div>
                
                <ul className="divide-y divide-gray-200">
                  {items.map(({ product, rentalDays }) => (
                    <li key={product.id} className="p-6 flex flex-col sm:flex-row sm:items-center">
                      <div className="flex-shrink-0 w-full sm:w-24 h-24 mb-4 sm:mb-0 sm:mr-6 bg-gray-100 rounded-md overflow-hidden">
                        <img 
                          src={product.imageUrl} 
                          alt={product.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-grow">
                        <Link 
                          to={`/products/${product.id}`}
                          className="text-lg font-medium text-fashion-DEFAULT hover:text-fashion-accent"
                        >
                          {product.name}
                        </Link>
                        <p className="text-fashion-muted text-sm mt-1">Size: {product.size}</p>
                        <div className="mt-2 flex items-center">
                          <span className="text-fashion-muted text-sm">Rental Period:</span>
                          <span className="ml-1 font-medium">{rentalDays} days</span>
                        </div>
                        <div className="mt-1 font-medium">${product.rentalPrice} × {rentalDays} = ${product.rentalPrice * rentalDays}</div>
                      </div>
                      
                      <button 
                        onClick={() => removeFromCart(product.id)}
                        className="mt-4 sm:mt-0 sm:ml-4 text-fashion-muted hover:text-red-500 transition"
                        aria-label="Remove item"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h2 className="text-xl font-semibold text-fashion-DEFAULT mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-fashion-muted">Subtotal</span>
                    <span className="font-medium">${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-fashion-muted">Processing Fee</span>
                    <span className="font-medium">$5.00</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-4">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold">${(totalPrice + 5).toFixed(2)}</span>
                  </div>
                </div>
                
                <Button
                  onClick={handleCheckout}
                  disabled={items.length === 0 || isProcessing}
                  className="w-full py-6 text-lg bg-fashion-accent hover:bg-fashion-accent/90"
                >
                  {isProcessing ? "Processing..." : "Checkout"}
                </Button>
                
                <p className="text-fashion-muted text-sm text-center mt-4">
                  By checking out, you agree to our Terms of Service and Rental Policy.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-fashion-DEFAULT mb-4">Your cart is empty</h2>
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
