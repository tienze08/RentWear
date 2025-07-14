import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { useCart } from "@/components/contexts/CartContext";
import { Button } from "@/components/ui/button";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Store, Product } from "@/lib/types";
import axiosInstance from "@/lib/axiosInstance";
import ApiConstants from "@/lib/api";
import { useRental } from "@/hooks/useRental";
import { useAuth } from "@/components/contexts/AuthContext";
import { eachDayOfInterval, parseISO } from "date-fns";

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [unavailableRanges, setUnavailableRanges] = useState<
    { start: string; end: string }[]
  >([]);
  const { addToCart, isInCart } = useCart();
  const { user } = useAuth();
  const { createRental } = useRental();
  // Tính số ngày thuê (bao gồm cả ngày bắt đầu và kết thúc)
  const rentalDays = Math.max(
    1,
    Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    ) + 1
  );

  useEffect(() => {
    const fetchUnavailableDates = async () => {
      try {
        const res = await axiosInstance.get(
          `/products/${productId}/unavailable-dates`
        );
        console.log("Unavailable Dates:", res.data);
        setUnavailableRanges(res.data);
      } catch (error) {
        console.error("Failed to fetch unavailable dates", error);
      }
    };

    const fetchProduct = async () => {
      try {
        const response = await axiosInstance.get(
          ApiConstants.GET_PRODUCT_BY_ID(productId || "")
        );
        if (response.status !== 200) {
          throw new Error("Product not found");
        }
        const data: Product = response.data;
        console.log("Fetched Product:", data);
        setProduct(data);
        if (data.storeId) {
          const storeResponse = await axiosInstance.get(
            ApiConstants.GET_STORE_BY_ID(data.storeId)
          );
          const storeData: Store = storeResponse.data;
          setStore(storeData);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
    fetchUnavailableDates();
    setLoading(false);
  }, [productId]);

  // Check for unavailable dates
  const getDisabledDates = (): Date[] => {
    return unavailableRanges.flatMap(({ start, end }) =>
      eachDayOfInterval({ start: parseISO(start), end: parseISO(end) })
    );
  };
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

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-fashion-DEFAULT mb-4">
            Product Not Found
          </h1>
          <p className="text-fashion-muted mb-8">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/products"
            className="px-6 py-2 bg-fashion-accent text-white rounded-lg hover:bg-fashion-accent/90 transition"
          >
            Browse All Products
          </Link>
        </div>
      </Layout>
    );
  }

  const handleAddRental = async () => {
    if (!user) {
      console.error("Bạn phải đăng nhập để thực hiện giao dịch này.");
      return;
    }
    try {
      const rental = await createRental({
        productId: productId,
        customerId: user._id,
        storeId: product.storeId,
        rentalStart: startDate.toISOString(),
        rentalEnd: endDate.toISOString(),
        totalPrice,
        depositPaid: false,
      });
      console.log("Rental created:", rental);
      addToCart(product, rentalDays);
    } catch (error) {
      console.error("Failed to create rental:", error);
    }
  };

  const totalPrice = product.rentalPrice * rentalDays;
  const inCart = isInCart(product._id);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Product Image */}
            <div className="lg:w-1/2">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-2xl border border-white/20 sticky top-8">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
                {/* Product badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  {product.available && (
                    <span className="bg-gradient-to-r from-green-400 to-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Có Sẵn
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="lg:w-1/2">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent mb-4">
                  {product.name}
                </h1>

                {store && (
                  <div className="mb-6">
                    <Link
                      to={`/stores/${store._id}`}
                      className="flex items-center gap-3 text-blue-600 hover:text-blue-700 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-blue-200 group-hover:border-blue-300 transition-colors">
                        <img
                          src={store.logoUrl}
                          alt={store.storeName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="font-semibold">{store.storeName}</span>
                      <svg
                        className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  </div>
                )}

                <div className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <span className="bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                    {product.rentalPrice.toLocaleString()} VNĐ
                  </span>
                  <span className="text-lg text-gray-500 font-normal">
                    /ngày
                  </span>
                </div>

                <p className="text-gray-600 mb-8 leading-relaxed text-lg">
                  {product.description}
                </p>

                {/* Product Info */}
                <div className="mb-8 space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                        />
                      </svg>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">
                        Kích thước:
                      </span>
                      <span className="ml-2 text-gray-600">{product.size}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-purple-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                      </svg>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">
                        Danh mục:
                      </span>
                      <span className="ml-2 text-gray-600">
                        {product.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-emerald-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">
                        Tình trạng:
                      </span>
                      <span
                        className={`ml-2 font-semibold ${
                          product.available
                            ? "text-emerald-600"
                            : "text-red-600"
                        }`}
                      >
                        {product.available ? "Có Sẵn" : "Hết Hàng"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Rental Period */}
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 mb-8 border border-gray-200">
                  <h3 className="text-xl font-bold mb-6 text-gray-800">
                    Thời Gian Thuê
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-semibold mb-3 text-gray-700">
                        Ngày Bắt Đầu
                      </label>
                      <DatePicker
                        selected={startDate}
                        onChange={(date: Date | null) => {
                          if (date) {
                            setStartDate(date);
                            if (date > endDate) setEndDate(date);
                          }
                        }}
                        minDate={new Date()}
                        dateFormat="yyyy-MM-dd"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-400 transition-colors"
                        excludeDates={getDisabledDates()}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-3 text-gray-700">
                        Ngày Kết Thúc
                      </label>
                      <DatePicker
                        selected={endDate}
                        onChange={(date: Date | null) => {
                          if (date) {
                            setEndDate(date);
                          }
                        }}
                        minDate={startDate}
                        dateFormat="yyyy-MM-dd"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-400 transition-colors"
                        excludeDates={getDisabledDates()}
                      />
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-white rounded-xl border border-gray-200">
                    <span className="text-lg font-semibold text-gray-700">
                      Số ngày:{" "}
                      <span className="text-blue-600">{rentalDays}</span>
                    </span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      Tổng: {totalPrice.toLocaleString()} VNĐ
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-4">
                  <Button
                    onClick={handleAddRental}
                    className={`w-full py-6 text-lg font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 ${
                      inCart
                        ? "bg-gray-200 hover:bg-gray-300 text-gray-700"
                        : "bg-gradient-to-r from-rose-500 to-purple-500 hover:from-rose-600 hover:to-purple-600 text-white shadow-lg"
                    }`}
                    disabled={!product.available || inCart}
                  >
                    {inCart ? "✓ Đã Thêm Vào Giỏ" : "Thêm Vào Giỏ Hàng"}
                  </Button>

                  {inCart && (
                    <Link to="/cart">
                      <Button
                        variant="outline"
                        className="w-full py-6 text-lg font-semibold border-2 border-blue-300 text-blue-600 hover:bg-blue-50 rounded-2xl transition-all duration-300"
                      >
                        Xem Giỏ Hàng
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;
