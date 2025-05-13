
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { ProductCard } from "@/components/product/ProductCard";
import { ShopCard } from "@/components/shop/ShopCard";
import { Product, Shop } from "@/types";
import { getFeaturedShops, mockProducts } from "@/data/mockData";

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [featuredShops, setFeaturedShops] = useState<Shop[]>([]);

  useEffect(() => {
    // Get a random selection of products to feature
    const randomProducts = [...mockProducts]
      .sort(() => 0.5 - Math.random())
      .slice(0, 4);
    
    setFeaturedProducts(randomProducts);
    
    // Get featured shops
    setFeaturedShops(getFeaturedShops());
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-fashion-DEFAULT to-fashion-accent text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Rent Designer Fashion For Any Occasion</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Choose from hundreds of styles across multiple boutiques and designers
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/products" 
              className="px-8 py-3 bg-white text-fashion-DEFAULT font-semibold rounded-lg shadow-md hover:bg-gray-100 transition"
            >
              Browse All Products
            </Link>
            <Link 
              to="/shops" 
              className="px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition"
            >
              Explore Shops
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Products Section */}
      <section className="py-12 bg-fashion-light">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-fashion-DEFAULT">Featured Products</h2>
            <Link 
              to="/products" 
              className="text-fashion-accent hover:text-fashion-accent/80 font-medium"
            >
              View All →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-fashion-DEFAULT text-center mb-12">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-fashion-accent rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">1</div>
              <h3 className="text-xl font-semibold mb-2">Browse & Select</h3>
              <p className="text-fashion-muted">Find the perfect outfit from our curated collection of designer pieces.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-fashion-accent rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">2</div>
              <h3 className="text-xl font-semibold mb-2">Rent</h3>
              <p className="text-fashion-muted">Choose your rental period and complete your order.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-fashion-accent rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">3</div>
              <h3 className="text-xl font-semibold mb-2">Wear & Return</h3>
              <p className="text-fashion-muted">Enjoy your rental and return it when you're done. No cleaning required!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Shops Section */}
      <section className="py-12 bg-fashion-light">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-fashion-DEFAULT">Featured Shops</h2>
            <Link 
              to="/shops" 
              className="text-fashion-accent hover:text-fashion-accent/80 font-medium"
            >
              View All →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredShops.map(shop => (
              <ShopCard key={shop.id} shop={shop} />
            ))}
          </div>
        </div>
      </section>

      {/* Join Banner */}
      <section className="py-16 bg-fashion-accent text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Refresh Your Wardrobe?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Discover designer pieces at a fraction of the cost with our clothing rental service.
          </p>
          <Link 
            to="/products" 
            className="px-8 py-3 bg-white text-fashion-accent font-semibold rounded-lg shadow-md hover:bg-gray-100 transition inline-block"
          >
            Start Browsing
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
