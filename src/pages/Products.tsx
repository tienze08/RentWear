import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { ProductCard } from "@/components/product/ProductCard";
import { getAllCategories } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Product } from "@/lib/types";
import ApiConstants from "@/lib/api";
import axiosInstance from "@/lib/axiosInstance";

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Get category filter from URL if present
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      setSelectedCategories([categoryParam]);
    }
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get(ApiConstants.LIST_PRODUCTS);
        const products = response.data;
        setProducts(products);
        console.log("Fetched products:", products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
    setCategories(getAllCategories());
  }, [searchParams]);

  // Apply filters
  useEffect(() => {
    let result = [...products];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (selectedCategories.length > 0) {
      result = result.filter((product) =>
        selectedCategories.includes(product.category)
      );
    }

    setFilteredProducts(result);
  }, [products, searchQuery, selectedCategories]);

  // Toggle category selection
  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((c) => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
    setSearchParams({});
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Khám Phá Bộ Sưu Tập
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Tìm kiếm những trang phục hoàn hảo cho mọi dịp đặc biệt của bạn
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Mobile filter toggle */}
            <div className="lg:hidden mb-4">
              <Button
                variant="outline"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="w-full border-2 border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 py-3 rounded-xl font-medium"
              >
                {isFilterOpen ? "Ẩn Bộ Lọc" : "Hiển Thị Bộ Lọc"}
              </Button>
            </div>

            {/* Filters */}
            <div
              className={`lg:w-1/4 ${
                isFilterOpen ? "block" : "hidden lg:block"
              }`}
            >
              <div className="bg-white/80 backdrop-blur-sm text-gray-800 p-8 rounded-2xl shadow-xl border border-white/20 sticky top-24">
                <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Bộ Lọc
                </h2>

                {/* Search */}
                <div className="mb-8">
                  <Label
                    htmlFor="search"
                    className="block mb-3 text-sm font-semibold text-gray-700"
                  >
                    Tìm Kiếm
                  </Label>
                  <Input
                    id="search"
                    placeholder="Tìm kiếm sản phẩm..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full border-2 border-blue-100 focus:border-blue-300 rounded-xl py-3 transition-all duration-300"
                  />
                </div>

                {/* Categories */}
                <div className="mb-8">
                  <h3 className="font-semibold mb-4 text-gray-700">Danh Mục</h3>
                  <div className="space-y-3">
                    {categories.map((category) => (
                      <div
                        key={category}
                        className="flex items-center p-2 rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        <Checkbox
                          id={`category-${category}`}
                          checked={selectedCategories.includes(category)}
                          onCheckedChange={() => toggleCategory(category)}
                          className="border-2 border-blue-200"
                        />
                        <Label
                          htmlFor={`category-${category}`}
                          className="ml-3 text-sm font-medium cursor-pointer text-gray-700"
                        >
                          {category}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Clear filters button */}
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="w-full border-2 border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 py-3 rounded-xl font-medium"
                >
                  Xóa Bộ Lọc
                </Button>
              </div>
            </div>

            {/* Products */}
            <div className="lg:w-3/4">
              {filteredProducts.length > 0 ? (
                <>
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-lg border border-white/20">
                    <p className="text-gray-600 text-lg font-medium">
                      Hiển thị{" "}
                      <span className="text-blue-600 font-bold">
                        {filteredProducts.length}
                      </span>{" "}
                      sản phẩm
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProducts.map((product) => (
                      <div
                        key={product._id}
                        className="transform hover:scale-105 transition-all duration-300"
                      >
                        <ProductCard product={product} />
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-20">
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 shadow-xl border border-white/20 max-w-md mx-auto">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg
                        className="w-10 h-10 text-blue-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8v0M7 5v0"
                        />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-gray-800">
                      Không tìm thấy sản phẩm
                    </h3>
                    <p className="text-gray-600 mb-8">
                      Hãy thử điều chỉnh bộ lọc hoặc tiêu chí tìm kiếm của bạn
                    </p>
                    <Button
                      onClick={clearFilters}
                      className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105"
                    >
                      Xóa Bộ Lọc
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Products;
