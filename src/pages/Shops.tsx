
import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { ShopCard } from "@/components/shop/ShopCard";
import { mockShops } from "@/data/mockData";
import { Shop } from "@/types";
import { Input } from "@/components/ui/input";

const Shops = () => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [filteredShops, setFilteredShops] = useState<Shop[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setShops(mockShops);
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      setFilteredShops(
        shops.filter(
          shop => 
            shop.name.toLowerCase().includes(query) || 
            shop.description.toLowerCase().includes(query)
        )
      );
    } else {
      setFilteredShops(shops);
    }
  }, [shops, searchQuery]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-fashion-DEFAULT mb-8">Browse Shops</h1>
        
        <div className="mb-8 max-w-md">
          <Input
            placeholder="Search shops..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        
        {filteredShops.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredShops.map(shop => (
              <ShopCard key={shop.id} shop={shop} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2">No shops found</h3>
            <p className="text-fashion-muted">
              Try a different search query or check back later for new shops.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Shops;
