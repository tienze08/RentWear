import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { StoreCard } from "@/components/store/StoreCard";
import { Input } from "@/components/ui/input";
import ApiConstants from "@/lib/api";
import { axiosInstance } from "@/lib/axiosInstance";
import { Store } from "@/lib/types";

const Stores = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [filteredStores, setFilteredStores] = useState<Store[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await axiosInstance.get(ApiConstants.STORES);
        const rawStores = response.data;
        const stores = rawStores.map((item: any) => ({
          ...item.storeInfo,
          _id: item._id,
        }));
        setStores(stores);
      } catch (error) {
        console.error("Error fetching stores:", error);
      }
    };

    fetchStores();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      setFilteredStores(
        stores.filter(
          (store) =>
            store.storeName.toLowerCase().includes(query) ||
            store.description.toLowerCase().includes(query)
        )
      );
    } else {
      setFilteredStores(stores);
    }
  }, [stores, searchQuery]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-blueberry mb-8">
          Browse Stores
        </h1>

        <div className="mb-8 max-w-md">
          <Input
            placeholder="Search stores..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>

        {filteredStores.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredStores.map((store) => (
              <StoreCard key={store._id} store={store} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2">No stores found</h3>
            <p className="text-fashion-muted">
              Try a different search query or check back later for new stores.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Stores;
