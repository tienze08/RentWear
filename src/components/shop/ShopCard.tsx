
import { Link } from "react-router-dom";
import { Shop } from "@/types";

interface ShopCardProps {
  shop: Shop;
}

export const ShopCard = ({ shop }: ShopCardProps) => {
  return (
    <Link 
      to={`/shops/${shop.id}`}
      className="block bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
    >
      <div className="p-6 flex flex-col items-center">
        <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-fashion-light">
          <img 
            src={shop.logoUrl}
            alt={shop.name}
            className="w-full h-full object-cover"
          />
        </div>
        <h3 className="text-xl font-semibold text-fashion-DEFAULT text-center">{shop.name}</h3>
        <p className="text-fashion-muted text-sm mt-2 text-center line-clamp-2">{shop.description}</p>
        
        {shop.featured && (
          <span className="mt-3 inline-block bg-fashion-accent/10 text-fashion-accent px-3 py-1 rounded-full text-xs font-medium">
            Featured Shop
          </span>
        )}
      </div>
    </Link>
  );
};
