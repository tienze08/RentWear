
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { ProductCard } from "@/components/product/ProductCard";
import { getShopById, getProductsByShop } from "@/data/mockData";
import { Shop, Product } from "@/types";

const ShopDetail = () => {
  const { shopId } = useParams<{ shopId: string }>();
  const [shop, setShop] = useState<Shop | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (shopId) {
      const foundShop = getShopById(shopId);
      
      if (foundShop) {
        setShop(foundShop);
        setProducts(getProductsByShop(foundShop.id));
      }
    }
    
    setLoading(false);
  }, [shopId]);

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

  if (!shop) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-fashion-DEFAULT mb-4">Shop Not Found</h1>
          <p className="text-fashion-muted mb-8">The shop you're looking for doesn't exist or has been removed.</p>
          <Link 
            to="/shops"
            className="px-6 py-2 bg-fashion-accent text-white rounded-lg hover:bg-fashion-accent/90 transition"
          >
            Browse All Shops
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Shop Info */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-24 h-24 rounded-full overflow-hidden flex-shrink-0 border-2 border-fashion-light">
              <img 
                src={shop.logoUrl} 
                alt={shop.name} 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div>
              <h1 className="text-3xl font-bold text-fashion-DEFAULT mb-2">{shop.name}</h1>
              <p className="text-fashion-muted">{shop.description}</p>
              
              {shop.featured && (
                <span className="mt-3 inline-block bg-fashion-accent/10 text-fashion-accent px-3 py-1 rounded-full text-xs font-medium">
                  Featured Shop
                </span>
              )}
            </div>
          </div>
        </div>
        
        {/* Shop Products */}
        <h2 className="text-2xl font-bold text-fashion-DEFAULT mb-6">Products from {shop.name}</h2>
        
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-medium mb-2">No products available</h3>
            <p className="text-fashion-muted">
              This shop doesn't have any products available for rent at the moment.
            </p>
            <Link 
              to="/shops"
              className="mt-4 inline-block px-6 py-2 bg-fashion-accent text-white rounded-lg hover:bg-fashion-accent/90 transition"
            >
              Browse Other Shops
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ShopDetail;
