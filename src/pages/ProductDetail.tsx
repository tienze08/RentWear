
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { getProductById, getShopById } from "@/data/mockData";
import { Product, Shop } from "@/types";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);
  const [rentalDays, setRentalDays] = useState(3);
  const { addToCart, isInCart } = useCart();
  
  useEffect(() => {
    if (productId) {
      const foundProduct = getProductById(productId);
      
      if (foundProduct) {
        setProduct(foundProduct);
        const foundShop = getShopById(foundProduct.shopId);
        setShop(foundShop || null);
      }
    }
    
    setLoading(false);
  }, [productId]);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 flex justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 w-64 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 w-48 bg-gray-200 rounded"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-fashion-DEFAULT mb-4">Product Not Found</h1>
          <p className="text-fashion-muted mb-8">The product you're looking for doesn't exist or has been removed.</p>
          <Link 
            to="/products"
            className="px-6 py-2 bg-fashion-accent text-white rounded-lg hover:bg-fashion-accent/90 transition"
          >
            Browse All Products
          </Link>
        </div>
      </Layout>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, rentalDays);
  };

  const totalPrice = product.rentalPrice * rentalDays;
  const inCart = isInCart(product.id);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Product Image */}
          <div className="lg:w-1/2">
            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="w-full h-auto object-cover aspect-square"
              />
            </div>
          </div>
          
          {/* Product Details */}
          <div className="lg:w-1/2">
            <h1 className="text-3xl font-bold text-fashion-DEFAULT mb-2">{product.name}</h1>
            
            {shop && (
              <div className="mb-4">
                <Link 
                  to={`/shops/${shop.id}`}
                  className="text-fashion-accent hover:text-fashion-accent/80 flex items-center gap-2"
                >
                  <img 
                    src={shop.logoUrl} 
                    alt={shop.name} 
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span>{shop.name}</span>
                </Link>
              </div>
            )}
            
            <div className="text-xl font-semibold mb-6">${product.rentalPrice}/day</div>
            
            <p className="text-fashion-muted mb-6">{product.description}</p>
            
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-2">
                <span className="font-medium">Size:</span>
                <span>{product.size}</span>
              </div>
              
              <div className="flex items-center gap-4 mb-2">
                <span className="font-medium">Category:</span>
                <span>{product.category}</span>
              </div>
              
              <div className="flex items-center gap-4">
                <span className="font-medium">Availability:</span>
                <span className={product.available ? "text-green-600" : "text-red-600"}>
                  {product.available ? "In Stock" : "Out of Stock"}
                </span>
              </div>
            </div>
            
            <div className="border-t border-b border-gray-200 py-6 my-6">
              <h3 className="font-semibold mb-4">Rental Duration</h3>
              
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Days: {rentalDays}</span>
                  <span className="text-sm font-medium">Total: ${totalPrice}</span>
                </div>
                <Slider
                  value={[rentalDays]}
                  min={1}
                  max={14}
                  step={1}
                  onValueChange={(value) => setRentalDays(value[0])}
                  className="mb-4"
                />
                <div className="flex justify-between">
                  <button
                    onClick={() => setRentalDays(Math.max(1, rentalDays - 1))}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                  >
                    -
                  </button>
                  <Input
                    type="number"
                    min={1}
                    max={14}
                    value={rentalDays}
                    onChange={(e) => setRentalDays(parseInt(e.target.value) || 1)}
                    className="w-20 text-center mx-2"
                  />
                  <button
                    onClick={() => setRentalDays(Math.min(14, rentalDays + 1))}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-4">
              <Button
                onClick={handleAddToCart}
                className={`w-full py-6 text-lg ${
                  inCart
                    ? "bg-gray-100 hover:bg-gray-200 text-fashion-DEFAULT"
                    : "bg-fashion-accent hover:bg-fashion-accent/90 text-white"
                }`}
                disabled={!product.available || inCart}
              >
                {inCart ? "Added to Cart" : "Add to Cart"}
              </Button>
              
              {inCart && (
                <Link to="/cart">
                  <Button variant="outline" className="w-full py-6 text-lg border-fashion-accent text-fashion-accent">
                    View Cart
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;
