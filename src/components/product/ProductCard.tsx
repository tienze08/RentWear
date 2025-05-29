import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { useCart } from "@/components/contexts/CartContext";
import type { Product } from "@/lib/types";
import { useAuth } from "../contexts/AuthContext";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart, isInCart } = useCart();
  const { user } = useAuth();
  const inCart = isInCart(product.id);

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <Link to={`/products/${product.id}`}>
        <div className="h-64 overflow-hidden">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-medium text-fashion-DEFAULT line-clamp-1">
            {product.name}
          </h3>
          <p className="text-fashion-muted text-sm mt-1 line-clamp-2">
            {product.description}
          </p>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-fashion-accent font-bold">
              ${product.rentalPrice}/day
            </span>
            <span className="text-sm text-fashion-muted">
              Size: {product.size}
            </span>
          </div>
        </div>
      </Link>
      <div className="px-4 pb-4">
        <Button
          variant={inCart ? "outline" : "default"}
          className={`w-full ${
            inCart
              ? "border-fashion-accent text-fashion-accent"
              : "bg-fashion-accent hover:bg-fashion-accent/90"
          }`}
          onClick={(e) => {
            e.preventDefault();
            if (!inCart) {
              addToCart(product, 3); // Default to 3 days rental
            }
          }}
          disabled={!user} 
        >
          {inCart ? "In Cart" : "Quick Add to Cart"}
        </Button>
      </div>
    </div>
  );
};
