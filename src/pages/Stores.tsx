import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { StoreCard } from "@/components/store/StoreCard";
import { Input } from "@/components/ui/input";
import ApiConstants from "@/lib/api";
import axiosInstance from "@/lib/axiosInstance";
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
        const stores = rawStores.map(
          (item: { storeInfo: Store; _id: string }) => ({
            ...item.storeInfo,
            _id: item._id,
          })
        );
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
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-4">
              Khám Phá Cửa Hàng
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Tìm kiếm những cửa hàng uy tín với bộ sưu tập thời trang đa dạng
            </p>
          </div>

          {/* Search Section */}
          <div className="mb-12 max-w-2xl mx-auto">
            <div className="relative">
              <Input
                placeholder="Tìm kiếm cửa hàng..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-lg border-2 border-emerald-200 focus:border-emerald-400 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg transition-all duration-300"
              />
              <svg
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-emerald-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Stores Grid */}
          {filteredStores.length > 0 ? (
            <>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-lg border border-white/20 max-w-md mx-auto">
                <p className="text-gray-600 text-lg font-medium text-center">
                  Tìm thấy{" "}
                  <span className="text-emerald-600 font-bold">
                    {filteredStores.length}
                  </span>{" "}
                  cửa hàng
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredStores.map((store) => (
                  <div
                    key={store._id}
                    className="transform hover:scale-105 transition-all duration-300"
                  >
                    <StoreCard store={store} />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 shadow-xl border border-white/20 max-w-md mx-auto">
                <div className="w-20 h-20 bg-gradient-to-r from-emerald-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-10 h-10 text-emerald-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800">
                  Không tìm thấy cửa hàng
                </h3>
                <p className="text-gray-600">
                  Hãy thử từ khóa tìm kiếm khác hoặc quay lại sau để xem thêm
                  cửa hàng mới.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Stores;
