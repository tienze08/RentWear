import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { ProductCard } from "@/components/product/ProductCard";
import { Product, Store } from "@/lib/types";
import ApiConstants from "@/lib/api";
import axiosInstance from "@/lib/axiosInstance";

const StoreDetail = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const [store, setStore] = useState<Store | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storeResponse = await axiosInstance.get(
          ApiConstants.GET_STORE_BY_ID(storeId || "")
        );
        const store = {
          ...storeResponse.data.storeInfo,
          _id: storeResponse.data._id,
        };
        setStore(store);

        const productsResponse = await axiosInstance.get(
          ApiConstants.GET_PRODUCTS_OF_STORE(storeId || "")
        );
        const products = productsResponse.data;
        setProducts(products);
      } catch (error) {
        console.error("Error fetching store details:", error);
        setStore(null);
      }
    };

    fetchData();
    setLoading(false);
  }, [storeId]);

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

  if (!store) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-fashion-DEFAULT mb-4">
            Store Not Found
          </h1>
          <p className="text-fashion-muted mb-8">
            The store you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/stores"
            className="px-6 py-2 bg-fashion-accent text-white rounded-lg hover:bg-fashion-accent/90 transition"
          >
            Browse All Stores
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Store Info */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-24 h-24 rounded-full overflow-hidden flex-shrink-0 border-2 border-fashion-light">
              <img
                src={store.logoUrl}
                alt={store.storeName}
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-fashion-DEFAULT mb-2">
                {store.storeName}
              </h1>
              <p className="text-fashion-muted">{store.description}</p>

              {store.featured && (
                <span className="mt-3 inline-block bg-dashboard-light-purple text-fashion-accent px-3 py-1 rounded-full text-xs font-medium">
                  Featured Store
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Store Products */}
        <h2 className="text-2xl font-bold text-fashion-DEFAULT mb-6">
          Products from {store.storeName}
        </h2>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-medium mb-2">No products available</h3>
            <p className="text-fashion-muted">
              This store doesn't have any products available for rent at the
              moment.
            </p>
            <Link
              to="/stores"
              className="mt-4 inline-block px-6 py-2 bg-fashion-accent text-white rounded-lg hover:bg-fashion-accent/90 transition"
            >
              Browse Other Stores
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default StoreDetail;
