
import { Store } from "@/lib/types";
import { Link } from "react-router-dom";


interface StoreCardProps {
  store: Store;
}


export const StoreCard = ({ store }: StoreCardProps) => {
  console.log("Store",store);
  return (
    <Link 
      to={`/stores/${store._id}`}
      className="block bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
    >
      <div className="p-6 flex flex-col items-center">
        <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-fashion-light">
          <img 
            src={store.avatar}
            alt={store.storeName}
            className="w-full h-full object-cover"
          />
        </div>
        <h3 className="text-xl font-semibold text-fashion-DEFAULT text-center">{store.storeName}</h3>
        <p className="text-fashion-muted text-sm mt-2 text-center line-clamp-2">{store.description}</p>

        {store.featured && (
          <span className="mt-3 inline-block bg-dashboard-light-purple text-fashion-accent px-3 py-1 rounded-full text-xs font-medium">
            Featured Store
          </span>
        )}
      </div>
    </Link>
  );
};
