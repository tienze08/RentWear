import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { ProductCard } from "@/components/product/ProductCard";
import { StoreCard } from "@/components/store/StoreCard";
import { Product, Store } from "@/lib/types";
import axiosInstance from "@/lib/axiosInstance";
import ApiConstants from "@/lib/api";
import { motion } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";

const categories = [
  { label: "Dress", value: "DRESS" },
  { label: "Suit", value: "SUIT" },
  { label: "Accessory", value: "ACCESSORY" },
];

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [featuredStores, setFeaturedStores] = useState<Store[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("DRESS");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productResponse = await axiosInstance.get(
          ApiConstants.LIST_PRODUCTS
        );
        const products: Product[] = productResponse.data;

        const storeResponse = await axiosInstance.get(ApiConstants.STORES);
        const rawStores = storeResponse.data;

        const stores: Store[] = rawStores.map(
          (item: { _id: string; storeInfo: Store }) => {
            return {
              ...item.storeInfo,
              _id: item._id,
            };
          }
        );

        const randomProducts = [...products]
          .sort(() => 0.5 - Math.random())
          .slice(0, 8);

        setFeaturedProducts(randomProducts);
        setFeaturedStores(stores.slice(0, 3));
      } catch (error) {
        console.error("Error fetching products:", error);
        setFeaturedProducts([]);
        setFeaturedStores([]);
      }
    };

    fetchData();
  }, []);

  const filteredProducts = featuredProducts.filter(
    (product) => product.category === selectedCategory
  );

  return (
    <Layout>
      {/* Hero Section */}
      <div className="bg-meringue text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-strawberry text-4xl md:text-5xl font-extrabold mb-4">
            <Typewriter
              words={["Rent Designer Fashion For Any Occasion"]}
              loop={true}
              cursor
              cursorStyle="|"
              typeSpeed={50}
              deleteSpeed={40}
              delaySpeed={2000}
            />
          </h1>
          <p className="text-strawberry text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Choose from hundreds of styles across multiple boutiques and
            designers
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/products"
              className="px-10 py-4 text-white bg-blueberry font-semibold rounded-lg shadow-lg hover:bg-blue-950 transition"
            >
              Browse All Products
            </Link>
            <Link
              to="/stores"
              className="px-10 py-4 bg-transparent border-2 border-blueberry text-blueberry font-semibold rounded-lg hover:bg-gray-300 transition"
            >
              Explore Stores
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Products Section */}
      <motion.section
        className="py-12 bg-fashion-light"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-blueberry">
              {""}
            </h2>
            <div className="flex gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  className={`ml-6 px-4 py-2 rounded-lg text-xl transition ${
                    selectedCategory === cat.value
                      ? "underline text-blueberry font-bold"
                      : "text-blueberry"
                  }`}
                  onClick={() => setSelectedCategory(cat.value)}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            <Link
              to="/products"
              className="text-blueberry hover:text-strawberry font-medium"
            >
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.length === 0 ? (
              <div className="col-span-4 text-center text-gray-500">
                No products in this category.
              </div>
            ) : (
              filteredProducts.map((product) => (
                <motion.div
                  key={product._id}
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="transition-transform"
                >
                  <ProductCard product={product} />
                </motion.div>
              ))
            )}
          </div>
        </div>
      </motion.section>

      {/* How It Works Section */}
      <motion.section
        className="py-16 bg-meringue"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-blueberry text-center mb-12">
            How It Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((step, index) => (
              <motion.div
                key={step}
                className="text-center"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="w-16 h-16 bg-strawberry rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  {step}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-blueberry">
                  {step === 1
                    ? "Browse & Select"
                    : step === 2
                    ? "Rent"
                    : "Wear & Return"}
                </h3>
                <p className="text-fashion-muted">
                  {step === 1
                    ? "Find the perfect outfit from our curated collection of designer pieces."
                    : step === 2
                    ? "Choose your rental period and complete your order."
                    : "Enjoy your rental and return it when you're done. No cleaning required!"}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Featured Stores Section */}
      <motion.section
        className="py-12 bg-fashion-light"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-blueberry">
              Featured Stores
            </h2>
            <Link
              to="/stores"
              className="text-blueberry  hover:text-strawberry font-medium"
            >
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredStores.map((store) => (
              <motion.div
                key={store._id}
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="transition-transform"
              >
                <StoreCard store={store} />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Join Banner */}
      <motion.section
        className="py-16 bg-meringue text-white bg-buttercream"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl text-strawberry md:text-3xl font-bold mb-4">
            Ready to Refresh Your Wardrobe?
          </h2>
          <p className="text-text text-xl mb-8 max-w-2xl mx-auto">
            Discover designer pieces at a fraction of the cost with our clothing
            rental service.
          </p>
          <Link
            to="/products"
            className="px-8 py-3 bg-blueberry text-white font-semibold rounded-lg shadow-md hover:bg-blue-950 transition inline-block text-dashboard-blue"
          >
            Start Browsing
          </Link>
        </div>
      </motion.section>
    </Layout>
  );
};

export default Home;
