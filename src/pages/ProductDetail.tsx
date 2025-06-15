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
import { useRental } from "@/components/contexts/RentalContext";
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

  // const handleAddToCart = () => {
  //   addToCart(product, rentalDays);
  // };

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
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Product Image */}
          <div className="lg:w-1/2">
            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-auto object-cover aspect-square"
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="lg:w-1/2">
            <h1 className="text-3xl font-bold text-fashion-DEFAULT mb-2">
              {product.name}
            </h1>

            {store && (
              <div className="mb-4">
                <Link
                  to={`/stores/${store._id}`}
                  className="text-fashion-accent hover:text-fashion-accent/80 flex items-center gap-2"
                >
                  <img
                    src={store.logoUrl}
                    alt={store.storeName}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span>{store.storeName}</span>
                </Link>
              </div>
            )}

            <div className="text-xl font-semibold mb-6">
              {product.rentalPrice} VNĐ/day
            </div>

            <p className="text-fashion-muted mb-6">{product.description}</p>

            <div className="mb-6">
              <div className="flex items-center gap-4 mb-2">
                <span className="font-medium">Size:</span>
                <span>{product.size}</span>
              </div>

              <div className="flex items-center gap-4 mb-2">
                <span className="font-medium">Category:</span>
                <span>{product.category}</span>
              </div>

              <div className="flex items-center gap-4">
                <span className="font-medium">Availability:</span>
                <span
                  className={
                    product.available ? "text-green-600" : "text-red-600"
                  }
                >
                  {product.available ? "In Stock" : "Out of Stock"}
                </span>
              </div>
            </div>

            <div className="border-t border-b border-gray-200 py-6 my-6">
              <h3 className="font-semibold mb-4">Rental Period</h3>
              <div className="mb-4 flex gap-4 items-center">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Start Date
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
                    className="w-40 px-2 py-1 border rounded"
                    excludeDates={getDisabledDates()}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    End Date
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
                    className="w-40 px-2 py-1 border rounded"
                    excludeDates={getDisabledDates()}
                  />
                </div>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-sm">Days: {rentalDays}</span>
                <span className="text-sm font-medium">
                  Total: {totalPrice} VNĐ
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <Button
                onClick={handleAddRental}
                className={`w-full py-6 text-lg hover:cursor-pointer ${
                  inCart
                    ? "bg-gray-100 hover:bg-gray-200 text-fashion-DEFAULT"
                    : "bg-fashion-accent hover:bg-fashion-accent/90 text-white"
                }`}
                disabled={!product.available || inCart}
              >
                {inCart ? "Added to Cart" : "Add to Cart"}
              </Button>

              {inCart && (
                <Link to="/cart">
                  <Button
                    variant="outline"
                    className="w-full py-6 text-lg border-fashion-accent text-fashion-accent"
                  >
                    View Cart
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;
