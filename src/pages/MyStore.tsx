import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Product, Store, Rental, Feedback } from "@/lib/types";
import axiosInstance from "@/lib/axiosInstance";
// import ApiConstants from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/components/contexts/AuthContext";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  Package,
  ShoppingBag,
  MessageSquare,
  Star,
  Calendar,
  User,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  DollarSign,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const MyStore = () => {
  const { user } = useAuth();
  const [store, setStore] = useState<Store | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    rentalPrice: "",
    category: "",
    size: "",
    images: [] as string[],
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editImage, setEditImage] = useState<File | null>(null);
  const [showEditProduct, setShowEditProduct] = useState(false);
  const [feedbackSort, setFeedbackSort] = useState<
    "newest" | "oldest" | "highest" | "lowest"
  >("newest");

  // Pagination states
  const [currentProductPage, setCurrentProductPage] = useState(1);
  const [currentRentalPage, setCurrentRentalPage] = useState(1);
  const [currentFeedbackPage, setCurrentFeedbackPage] = useState(1);
  const itemsPerPage = 6; // Products per page
  const rentalsPerPage = 10; // Rentals per page
  const feedbacksPerPage = 5; // Feedbacks per page

  // Fetch store and products data
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user?._id) return;
        console.log("user", user);
        // Fetch store info
        const storeResponse = await axiosInstance.get(`/stores/${user._id}`);
        const storeData = {
          _id: storeResponse.data._id,
          ...storeResponse.data.storeInfo,
        };
        console.log("storeData", storeData);
        setStore(storeData);

        // Fetch store products
        const productsResponse = await axiosInstance.get(
          `/products/store/${storeData._id}`
        );
        setProducts(productsResponse.data);

        // Fetch store rentals
        console.log("Store ID", storeData._id);
        const rentalsResponse = await axiosInstance.get(
          `/rentals/store/${storeData._id}`
        );
        const allRentals = rentalsResponse.data;
        console.log("All Rentals", allRentals);
        // Filter rentals for this store
        const storeRentals = allRentals.filter(
          (rental: Rental) => rental.storeId === storeData._id
        );
        setRentals(storeRentals);
        // Fetch store feedbacks
        const feedbacksResponse = await axiosInstance.get(
          `/feedbacks/store/${storeData._id}`
        );
        setFeedbacks(feedbacksResponse.data);
        console.log("Feedbacks", feedbacksResponse.data);
      } catch (error) {
        console.error("Error fetching store data:", error);
        toast.error("Failed to load store data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Handle new product submission
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!selectedImage) {
        toast.error("Please select an image");
        return;
      }

      // Prepare form data for multipart upload
      const formData = new FormData();
      formData.append("product", selectedImage); // file field must be 'product'
      formData.append("name", newProduct.name);
      formData.append("description", newProduct.description);
      formData.append("rentalPrice", newProduct.rentalPrice);
      formData.append("category", newProduct.category);
      formData.append("size", newProduct.size);

      const response = await axiosInstance.post("/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // The backend returns { message, product }
      setProducts([...products, response.data.product]);
      setShowAddProduct(false);
      setNewProduct({
        name: "",
        description: "",
        rentalPrice: "",
        category: "",
        size: "",
        images: [],
      });
      setSelectedImage(null);
      toast.success("Product added successfully");
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  // Calculate feedback statistics
  const totalFeedbacks = feedbacks.length;
  const averageRating =
    feedbacks.length > 0
      ? feedbacks.reduce((sum, feedback) => sum + (feedback.rating || 5), 0) /
        feedbacks.length
      : 0;
  const recentFeedbacks = feedbacks.filter(
    (feedback) =>
      new Date(feedback.createdAt) >
      new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  ).length;

  // Sort feedbacks based on selected criteria
  const sortedFeedbacks = [...feedbacks].sort((a, b) => {
    switch (feedbackSort) {
      case "newest":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "oldest":
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      case "highest":
        return (b.rating || 5) - (a.rating || 5);
      case "lowest":
        return (a.rating || 5) - (b.rating || 5);
      default:
        return 0;
    }
  });

  // Pagination calculations
  const totalProductPages = Math.ceil(products.length / itemsPerPage);
  const totalRentalPages = Math.ceil(rentals.length / rentalsPerPage);
  const totalFeedbackPages = Math.ceil(
    sortedFeedbacks.length / feedbacksPerPage
  );

  const paginatedProducts = products.slice(
    (currentProductPage - 1) * itemsPerPage,
    currentProductPage * itemsPerPage
  );

  const paginatedRentals = rentals.slice(
    (currentRentalPage - 1) * rentalsPerPage,
    currentRentalPage * rentalsPerPage
  );

  const paginatedFeedbacks = sortedFeedbacks.slice(
    (currentFeedbackPage - 1) * feedbacksPerPage,
    currentFeedbackPage * feedbacksPerPage
  );

  // Pagination component
  const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
  }: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  }) => {
    if (totalPages <= 1) return null;

    const pages = [];
    const showPages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
    const endPage = Math.min(totalPages, startPage + showPages - 1);

    if (endPage - startPage + 1 < showPages) {
      startPage = Math.max(1, endPage - showPages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="flex items-center justify-center gap-2 mt-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        {startPage > 1 && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(1)}
              className="px-3 py-1"
            >
              1
            </Button>
            {startPage > 2 && <span className="px-2">...</span>}
          </>
        )}

        {pages.map((page) => (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(page)}
            className="px-3 py-1"
          >
            {page}
          </Button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="px-2">...</span>}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(totalPages)}
              className="px-3 py-1"
            >
              {totalPages}
            </Button>
          </>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    );
  };

  // Calculate store statistics
  const totalProducts = products.length;
  const totalRentals = rentals.length;
  const totalRevenue = rentals.reduce(
    (sum, rental) => sum + rental.totalPrice,
    0
  );
  const completedRentals = rentals.filter(
    (r) => r.status === "RETURNED"
  ).length;

  // Example: Generate dummy monthly revenue data (replace with real data if available)
  const monthlyRevenue = [
    { month: "Jan", revenue: 0 },
    { month: "Feb", revenue: 0 },
    { month: "Mar", revenue: 0 },
    { month: "Apr", revenue: 0 },
    { month: "May", revenue: 0 },
    { month: "Jun", revenue: 0 },
    { month: "Jul", revenue: 0 },
    { month: "Aug", revenue: 0 },
    { month: "Sep", revenue: 0 },
    { month: "Oct", revenue: 0 },
    { month: "Nov", revenue: 0 },
    { month: "Dec", revenue: 0 },
  ];
  // Calculate real monthly revenue from rentals
  rentals.forEach((rental) => {
    const date = new Date(rental.rentalStart);
    const month = date.getMonth();
    monthlyRevenue[month].revenue += rental.totalPrice;
  });

  // Handle delete product
  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      await axiosInstance.delete(`/products/${productId}`);
      setProducts(products.filter((p) => p._id !== productId));
      toast.success("Product deleted successfully");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    }
  };

  // Handle open edit form
  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setEditImage(null);
    setShowEditProduct(true);
  };

  // Handle update product
  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (!editingProduct) return;
    try {
      let updateData: {
        name: string;
        description: string;
        rentalPrice: number;
        category: string;
        size: string;
        available: boolean;
      } = {
        name: editingProduct.name,
        description: editingProduct.description,
        rentalPrice: editingProduct.rentalPrice,
        category: editingProduct.category,
        size: editingProduct.size,
        available: editingProduct.available,
      };
      let config = {};
      if (editImage) {
        const formData = new FormData();
        Object.entries(updateData).forEach(([k, v]) =>
          formData.append(k, v as string)
        );
        formData.append("product", editImage);
        updateData = formData as unknown as {
          name: string;
          description: string;
          rentalPrice: number;
          category: string;
          size: string;
          available: boolean;
        };
        config = { headers: { "Content-Type": "multipart/form-data" } };
      }
      console.log("updateData", updateData);
      const res = await axiosInstance.put(
        `/products/${editingProduct._id}`,
        updateData,
        config
      );
      setProducts(
        products.map((p) => (p._id === editingProduct._id ? res.data : p))
      );
      setEditingProduct(null);
      setEditImage(null);
      setShowEditProduct(false);
      toast.success("Product updated successfully");
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
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
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Store Not Found</h1>
          <p className="text-gray-600 mb-4">You don't have a store yet.</p>
          <Button onClick={() => (window.location.href = "/create-store")}>
            Create Store
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Store Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <img
              src={store.logoUrl}
              alt={store.storeName}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h1 className="text-2xl font-bold">{store.storeName}</h1>
              <p className="text-gray-600">{store.description}</p>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <Tabs defaultValue="statistics" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger
              value="statistics"
              className="flex items-center gap-2 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 hover:bg-blue-50 transition"
            >
              <BarChart3 className="w-4 h-4" />
              Thống kê
            </TabsTrigger>
            <TabsTrigger
              value="products"
              className="flex items-center gap-2 data-[state=active]:bg-green-100 data-[state=active]:text-green-700 hover:bg-green-50 transition"
            >
              <Package className="w-4 h-4" />
              Sản phẩm
            </TabsTrigger>
            <TabsTrigger
              value="rentals"
              className="flex items-center gap-2 data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 hover:bg-purple-50 transition"
            >
              <ShoppingBag className="w-4 h-4" />
              Đơn thuê
            </TabsTrigger>
            <TabsTrigger
              value="feedback"
              className="flex items-center gap-2 data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700 hover:bg-orange-50 transition"
            >
              <MessageSquare className="w-4 h-4" />
              Feedback
            </TabsTrigger>
          </TabsList>

          {/* Statistics Tab */}
          <TabsContent value="statistics">
            <div className="space-y-8">
              {/* Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-lg p-6 border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-700 mb-1">
                        Tổng sản phẩm
                      </p>
                      <p className="text-3xl font-bold text-blue-900">
                        {totalProducts}
                      </p>
                      <p className="text-xs text-blue-600 mt-1">
                        +12% từ tháng trước
                      </p>
                    </div>
                    <div className="bg-blue-200 p-3 rounded-full">
                      <Package className="w-6 h-6 text-blue-700" />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-lg p-6 border border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-700 mb-1">
                        Tổng đơn thuê
                      </p>
                      <p className="text-3xl font-bold text-green-900">
                        {totalRentals}
                      </p>
                      <p className="text-xs text-green-600 mt-1">
                        +8% từ tháng trước
                      </p>
                    </div>
                    <div className="bg-green-200 p-3 rounded-full">
                      <ShoppingBag className="w-6 h-6 text-green-700" />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-lg p-6 border border-purple-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-700 mb-1">
                        Đơn hoàn thành
                      </p>
                      <p className="text-3xl font-bold text-purple-900">
                        {completedRentals}
                      </p>
                      <p className="text-xs text-purple-600 mt-1">
                        Tỷ lệ:{" "}
                        {totalRentals > 0
                          ? Math.round((completedRentals / totalRentals) * 100)
                          : 0}
                        %
                      </p>
                    </div>
                    <div className="bg-purple-200 p-3 rounded-full">
                      <TrendingUp className="w-6 h-6 text-purple-700" />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl shadow-lg p-6 border border-orange-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-orange-700 mb-1">
                        Tổng doanh thu
                      </p>
                      <p className="text-3xl font-bold text-orange-900">
                        {totalRevenue.toLocaleString()}
                      </p>
                      <p className="text-xs text-orange-600 mt-1">VNĐ</p>
                    </div>
                    <div className="bg-orange-200 p-3 rounded-full">
                      <DollarSign className="w-6 h-6 text-orange-700" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Revenue Chart */}
              <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <BarChart3 className="w-6 h-6 text-blue-600" />
                    Biểu đồ doanh thu theo tháng
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-3 h-3 bg-orange-400 rounded"></div>
                    <span>Doanh thu (VNĐ)</span>
                  </div>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={monthlyRevenue}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis
                        dataKey="month"
                        tick={{ fontSize: 12 }}
                        stroke="#6b7280"
                      />
                      <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
                      <Tooltip
                        formatter={(
                          value: string | number | (string | number)[]
                        ) => [
                          `${Number(value).toLocaleString()} VNĐ`,
                          "Doanh thu",
                        ]}
                        contentStyle={{
                          backgroundColor: "#fff",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                        }}
                      />
                      <Bar
                        dataKey="revenue"
                        fill="url(#colorGradient)"
                        radius={[4, 4, 0, 0]}
                      />
                      <defs>
                        <linearGradient
                          id="colorGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#fb923c"
                            stopOpacity={0.9}
                          />
                          <stop
                            offset="95%"
                            stopColor="#fed7aa"
                            stopOpacity={0.7}
                          />
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">
                    Sản phẩm phổ biến
                  </h4>
                  <div className="space-y-3">
                    {products.slice(0, 3).map((product, index) => (
                      <div
                        key={product._id}
                        className="flex items-center gap-3"
                      >
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-800 text-sm">
                            {product.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {product.category}
                          </p>
                        </div>
                        <span className="text-sm font-semibold text-gray-600">
                          {product.rentalPrice.toLocaleString()} VNĐ
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">
                    Feedback gần đây
                  </h4>
                  <div className="space-y-3">
                    {feedbacks.slice(0, 3).map((feedback) => (
                      <div
                        key={feedback._id}
                        className="flex items-start gap-3"
                      >
                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                          <Star className="w-4 h-4 text-orange-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-800 text-sm">
                            {feedback.customerId.username}
                          </p>
                          <p className="text-xs text-gray-500 line-clamp-2">
                            {feedback.comment}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span className="text-xs font-medium">
                            {feedback.rating || 5}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">
                    Thống kê nhanh
                  </h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Điểm đánh giá TB
                      </span>
                      <span className="font-semibold text-yellow-600">
                        {averageRating.toFixed(1)} ⭐
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Sản phẩm có sẵn
                      </span>
                      <span className="font-semibold text-green-600">
                        {products.filter((p) => p.available).length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Đang cho thuê
                      </span>
                      <span className="font-semibold text-blue-600">
                        {products.filter((p) => !p.available).length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Feedback tuần này
                      </span>
                      <span className="font-semibold text-purple-600">
                        {recentFeedbacks}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products">
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <Package className="w-6 h-6 text-green-600" />
                    Quản lý sản phẩm
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Tổng {products.length} sản phẩm
                  </p>
                </div>
                <Button
                  onClick={() => setShowAddProduct(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg shadow-md transition-colors"
                >
                  <Package className="w-4 h-4 mr-2" />
                  Thêm sản phẩm mới
                </Button>
              </div>

              {products.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <Package className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    Chưa có sản phẩm nào
                  </h3>
                  <p className="text-gray-500 max-w-md mx-auto mb-6">
                    Hãy thêm sản phẩm đầu tiên để bắt đầu kinh doanh cho thuê
                    trang phục.
                  </p>
                  <Button
                    onClick={() => setShowAddProduct(true)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Thêm sản phẩm ngay
                  </Button>
                </div>
              ) : (
                <>
                  {/* Products Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {paginatedProducts.map((product) => (
                      <div
                        key={product._id}
                        className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-200 group"
                      >
                        <div className="relative">
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                          <div className="absolute top-3 right-3">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                product.available
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {product.available ? "Có sẵn" : "Đang thuê"}
                            </span>
                          </div>
                        </div>
                        <div className="p-5">
                          <div className="mb-3">
                            <h3 className="font-semibold text-lg text-gray-800 mb-1 line-clamp-1">
                              {product.name}
                            </h3>
                            <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                              {product.description}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <span className="bg-gray-100 px-2 py-1 rounded">
                                {product.category}
                              </span>
                              <span className="bg-gray-100 px-2 py-1 rounded">
                                Size {product.size}
                              </span>
                            </div>
                          </div>

                          <div className="flex justify-between items-center mb-4">
                            <div>
                              <span className="text-2xl font-bold text-green-600">
                                {product.rentalPrice.toLocaleString()}
                              </span>
                              <span className="text-sm text-gray-500 ml-1">
                                VNĐ/ngày
                              </span>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditProduct(product)}
                              className="flex-1 border-blue-200 text-blue-700 hover:bg-blue-50"
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              Sửa
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteProduct(product._id)}
                              className="flex-1 border-red-200 text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Xóa
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  <Pagination
                    currentPage={currentProductPage}
                    totalPages={totalProductPages}
                    onPageChange={setCurrentProductPage}
                  />
                </>
              )}
            </div>
          </TabsContent>

          {/* Rentals Tab */}
          <TabsContent value="rentals">
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <ShoppingBag className="w-6 h-6 text-purple-600" />
                    Quản lý đơn thuê
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Tổng {rentals.length} đơn thuê
                  </p>
                </div>

                {/* Status Filter */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <span className="text-gray-600">
                      Chờ xử lý:{" "}
                      {rentals.filter((r) => r.status === "PENDING").length}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                    <span className="text-gray-600">
                      Đã duyệt:{" "}
                      {rentals.filter((r) => r.status === "APPROVED").length}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span className="text-gray-600">
                      Đã trả:{" "}
                      {rentals.filter((r) => r.status === "RETURNED").length}
                    </span>
                  </div>
                </div>
              </div>

              {rentals.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <ShoppingBag className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    Chưa có đơn thuê nào
                  </h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    Khi khách hàng thuê sản phẩm của bạn, thông tin đơn thuê sẽ
                    xuất hiện ở đây.
                  </p>
                </div>
              ) : (
                <>
                  {/* Desktop Table View */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200 bg-gray-50">
                          <th className="text-left py-4 px-4 font-semibold text-gray-700">
                            Sản phẩm
                          </th>
                          <th className="text-left py-4 px-4 font-semibold text-gray-700">
                            Khách hàng
                          </th>
                          <th className="text-left py-4 px-4 font-semibold text-gray-700">
                            Thời gian thuê
                          </th>
                          <th className="text-left py-4 px-4 font-semibold text-gray-700">
                            Tổng tiền
                          </th>
                          <th className="text-left py-4 px-4 font-semibold text-gray-700">
                            Trạng thái
                          </th>
                          <th className="text-left py-4 px-4 font-semibold text-gray-700">
                            Thao tác
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedRentals.map((rental) => (
                          <tr
                            key={rental._id}
                            className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                          >
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-3">
                                {rental.productId &&
                                rental.productId.images &&
                                rental.productId.images[0] ? (
                                  <img
                                    src={rental.productId.images[0]}
                                    alt={rental.productId.name}
                                    className="w-12 h-12 object-cover rounded-lg"
                                  />
                                ) : (
                                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                                    <Package className="w-6 h-6 text-gray-400" />
                                  </div>
                                )}
                                <div>
                                  <p className="font-medium text-gray-800">
                                    {rental.productId?.name ||
                                      "Sản phẩm không tồn tại"}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {rental.productId?.category}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                  <User className="w-4 h-4 text-purple-600" />
                                </div>
                                <span className="font-medium text-gray-800">
                                  {rental.customerId.username}
                                </span>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="text-sm">
                                <p className="font-medium text-gray-800">
                                  {new Date(
                                    rental.rentalStart
                                  ).toLocaleDateString("vi-VN")}
                                </p>
                                <p className="text-gray-500">
                                  đến{" "}
                                  {new Date(
                                    rental.rentalEnd
                                  ).toLocaleDateString("vi-VN")}
                                </p>
                                <p className="text-xs text-purple-600 mt-1">
                                  {Math.ceil(
                                    (new Date(rental.rentalEnd).getTime() -
                                      new Date(rental.rentalStart).getTime()) /
                                      (1000 * 60 * 60 * 24)
                                  )}{" "}
                                  ngày
                                </p>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <span className="font-bold text-lg text-green-600">
                                {rental.totalPrice.toLocaleString()}
                              </span>
                              <span className="text-sm text-gray-500 ml-1">
                                VNĐ
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <span
                                className={`px-3 py-1 rounded-full text-sm font-medium ${
                                  rental.status === "RETURNED"
                                    ? "bg-green-100 text-green-800"
                                    : rental.status === "PENDING"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : rental.status === "APPROVED"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {rental.status === "RETURNED" && "Đã trả"}
                                {rental.status === "PENDING" && "Chờ xử lý"}
                                {rental.status === "APPROVED" && "Đã duyệt"}
                                {rental.status === "CANCELED" && "Đã hủy"}
                                {![
                                  "RETURNED",
                                  "PENDING",
                                  "APPROVED",
                                  "CANCELED",
                                ].includes(rental.status) && rental.status}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-blue-600 border-blue-200 hover:bg-blue-50"
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                Chi tiết
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Card View */}
                  <div className="md:hidden space-y-4">
                    {paginatedRentals.map((rental) => (
                      <div
                        key={rental._id}
                        className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                      >
                        <div className="flex items-start gap-3 mb-3">
                          {rental.productId &&
                          rental.productId.images &&
                          rental.productId.images[0] ? (
                            <img
                              src={rental.productId.images[0]}
                              alt={rental.productId.name}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                              <Package className="w-8 h-8 text-gray-400" />
                            </div>
                          )}
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-800">
                              {rental.productId?.name ||
                                "Sản phẩm không tồn tại"}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {rental.customerId.username}
                            </p>
                            <span
                              className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                                rental.status === "RETURNED"
                                  ? "bg-green-100 text-green-800"
                                  : rental.status === "PENDING"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : rental.status === "APPROVED"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {rental.status === "RETURNED" && "Đã trả"}
                              {rental.status === "PENDING" && "Chờ xử lý"}
                              {rental.status === "APPROVED" && "Đã duyệt"}
                              {rental.status === "CANCELED" && "Đã hủy"}
                            </span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Thời gian thuê</p>
                            <p className="font-medium">
                              {new Date(rental.rentalStart).toLocaleDateString(
                                "vi-VN"
                              )}{" "}
                              -{" "}
                              {new Date(rental.rentalEnd).toLocaleDateString(
                                "vi-VN"
                              )}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Tổng tiền</p>
                            <p className="font-bold text-green-600">
                              {rental.totalPrice.toLocaleString()} VNĐ
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  <Pagination
                    currentPage={currentRentalPage}
                    totalPages={totalRentalPages}
                    onPageChange={setCurrentRentalPage}
                  />
                </>
              )}
            </div>
          </TabsContent>

          {/* Feedback Tab */}
          <TabsContent value="feedback">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <MessageSquare className="w-6 h-6 text-orange-600" />
                  Phản hồi từ khách hàng
                </h2>
              </div>

              {/* Feedback Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-orange-800">
                        Tổng phản hồi
                      </p>
                      <p className="text-2xl font-bold text-orange-900">
                        {totalFeedbacks}
                      </p>
                    </div>
                    <MessageSquare className="w-8 h-8 text-orange-600" />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-yellow-800">
                        Điểm trung bình
                      </p>
                      <div className="flex items-center gap-1">
                        <p className="text-2xl font-bold text-yellow-900">
                          {averageRating.toFixed(1)}
                        </p>
                        <Star className="w-5 h-5 text-yellow-500 fill-current" />
                      </div>
                    </div>
                    <div className="flex">
                      {[...Array(5)].map((_, index) => (
                        <Star
                          key={index}
                          className={`w-4 h-4 ${
                            index < Math.round(averageRating)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-800">
                        Phản hồi tuần này
                      </p>
                      <p className="text-2xl font-bold text-green-900">
                        {recentFeedbacks}
                      </p>
                    </div>
                    <Calendar className="w-8 h-8 text-green-600" />
                  </div>
                </div>
              </div>

              {/* Sort Controls */}
              {feedbacks.length > 0 && (
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-600">
                      Sắp xếp theo:
                    </span>
                    <select
                      value={feedbackSort}
                      onChange={(e) =>
                        setFeedbackSort(
                          e.target.value as
                            | "newest"
                            | "oldest"
                            | "highest"
                            | "lowest"
                        )
                      }
                      className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="newest">Mới nhất</option>
                      <option value="oldest">Cũ nhất</option>
                      <option value="highest">Điểm cao nhất</option>
                      <option value="lowest">Điểm thấp nhất</option>
                    </select>
                  </div>
                  <div className="text-sm text-gray-500">
                    Hiển thị {feedbacks.length} phản hồi
                  </div>
                </div>
              )}

              {feedbacks.length > 0 ? (
                <div className="space-y-6">
                  {paginatedFeedbacks.map((feedback) => (
                    <div
                      key={feedback._id}
                      className="bg-gradient-to-r from-gray-50 to-orange-50 border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-md">
                            <User className="w-7 h-7" />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 text-lg">
                              {feedback.customerId.username}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Calendar className="w-4 h-4" />
                              <span>
                                {new Date(
                                  feedback.createdAt
                                ).toLocaleDateString("vi-VN", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Rating stars */}
                        <div className="flex flex-col items-end">
                          <div className="flex items-center gap-1 mb-1">
                            {[...Array(5)].map((_, index) => (
                              <Star
                                key={index}
                                className={`w-5 h-5 ${
                                  index < (feedback.rating || 5)
                                    ? "text-yellow-400 fill-current"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                            {feedback.rating || 5}/5 điểm
                          </span>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-5 border-l-4 border-orange-400 shadow-sm">
                        <p className="text-gray-700 leading-relaxed italic text-lg">
                          "{feedback.comment}"
                        </p>
                      </div>

                      {/* Additional info */}
                      <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <MessageSquare className="w-4 h-4" />
                            Phản hồi về cửa hàng
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              (feedback.rating || 5) >= 4
                                ? "bg-green-400"
                                : (feedback.rating || 5) >= 3
                                ? "bg-yellow-400"
                                : "bg-red-400"
                            }`}
                          ></div>
                          <span className="text-xs">
                            {(feedback.rating || 5) >= 4
                              ? "Tích cực"
                              : (feedback.rating || 5) >= 3
                              ? "Trung bình"
                              : "Cần cải thiện"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Pagination */}
                  <Pagination
                    currentPage={currentFeedbackPage}
                    totalPages={totalFeedbackPages}
                    onPageChange={setCurrentFeedbackPage}
                  />
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    Chưa có phản hồi nào
                  </h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    Khi khách hàng để lại phản hồi về cửa hàng của bạn, chúng sẽ
                    xuất hiện ở đây.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Add Product Form Modal */}
        {showAddProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Add New Product</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowAddProduct(false)}
                  className="hover:bg-gray-100"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </Button>
              </div>

              <form onSubmit={handleAddProduct} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">
                      Product Name
                    </Label>
                    <Input
                      id="name"
                      value={newProduct.name}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, name: e.target.value })
                      }
                      placeholder="Enter product name"
                      className="w-full"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="rentalPrice"
                      className="text-sm font-medium"
                    >
                      Rental Price (VNĐ/day)
                    </Label>
                    <Input
                      id="rentalPrice"
                      type="number"
                      value={newProduct.rentalPrice}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          rentalPrice: e.target.value,
                        })
                      }
                      placeholder="Enter rental price"
                      className="w-full"
                      min="0"
                      required
                    />
                  </div>
                  {/* <div className="flex justify-end gap-4 pt-4 border-t">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowAddProduct(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {loading ? "Processing..." : "Add Product"}
                    </Button>
                  </div> */}

                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-sm font-medium">
                      Category
                    </Label>
                    <select
                      id="category"
                      value={newProduct.category}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          category: e.target.value,
                        })
                      }
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                      required
                    >
                      <option value="">Select a category</option>
                      <option value="DRESS">Dress</option>
                      <option value="SUIT">Suit</option>
                      <option value="ACCESSORY">Accessory</option>
                      <option value="SHOES">Shoes</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="size" className="text-sm font-medium">
                      Size
                    </Label>
                    <select
                      id="size"
                      value={newProduct.size}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, size: e.target.value })
                      }
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                      required
                    >
                      <option value="">Select a size</option>
                      <option value="XS">XS</option>
                      <option value="S">S</option>
                      <option value="M">M</option>
                      <option value="L">L</option>
                      <option value="XL">XL</option>
                      <option value="XXL">XXL</option>
                    </select>
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <Label
                      htmlFor="description"
                      className="text-sm font-medium"
                    >
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      value={newProduct.description}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          description: e.target.value,
                        })
                      }
                      placeholder="Enter product description"
                      className="w-full min-h-[100px]"
                      required
                    />
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="image" className="text-sm font-medium">
                      Product Image
                    </Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      {selectedImage ? (
                        <div className="space-y-4">
                          <img
                            src={URL.createObjectURL(selectedImage)}
                            alt="Preview"
                            className="mx-auto max-h-48 rounded-lg"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setSelectedImage(null)}
                            className="mt-2"
                          >
                            Change Image
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex flex-col items-center justify-center">
                            <svg
                              className="w-12 h-12 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            <p className="mt-2 text-sm text-gray-600">
                              Click to upload or drag and drop
                            </p>
                            <p className="text-xs text-gray-500">
                              PNG, JPG, GIF up to 10MB
                            </p>
                          </div>
                          <Input
                            id="image"
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              setSelectedImage(
                                e.target.files ? e.target.files[0] : null
                              )
                            }
                            className="hidden"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                              document.getElementById("image")?.click()
                            }
                          >
                            Select Image
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddProduct(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Add Product
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Product Form Modal */}
        {showEditProduct && editingProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Edit Product</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setShowEditProduct(false);
                    setEditingProduct(null);
                    setEditImage(null);
                  }}
                  className="hover:bg-gray-100"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </Button>
              </div>
              <form onSubmit={handleUpdateProduct} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name" className="text-sm font-medium">
                      Product Name
                    </Label>
                    <Input
                      id="edit-name"
                      value={editingProduct.name}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          name: e.target.value,
                        })
                      }
                      placeholder="Enter product name"
                      className="w-full"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="edit-rentalPrice"
                      className="text-sm font-medium"
                    >
                      Rental Price (VNĐ/day)
                    </Label>
                    <Input
                      id="edit-rentalPrice"
                      type="number"
                      value={editingProduct.rentalPrice}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          rentalPrice: Number(e.target.value),
                        })
                      }
                      placeholder="Enter rental price"
                      className="w-full"
                      min="0"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="edit-category"
                      className="text-sm font-medium"
                    >
                      Category
                    </Label>
                    <select
                      id="edit-category"
                      value={editingProduct.category}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          category: e.target.value,
                        })
                      }
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                      required
                    >
                      <option value="">Select a category</option>
                      <option value="DRESS">Dress</option>
                      <option value="SUIT">Suit</option>
                      <option value="ACCESSORY">Accessory</option>
                      <option value="SHOES">Shoes</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-size" className="text-sm font-medium">
                      Size
                    </Label>
                    <select
                      id="edit-size"
                      value={editingProduct.size}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          size: e.target.value,
                        })
                      }
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                      required
                    >
                      <option value="">Select a size</option>
                      <option value="XS">XS</option>
                      <option value="S">S</option>
                      <option value="M">M</option>
                      <option value="L">L</option>
                      <option value="XL">XL</option>
                      <option value="XXL">XXL</option>
                    </select>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label
                      htmlFor="edit-description"
                      className="text-sm font-medium"
                    >
                      Description
                    </Label>
                    <Textarea
                      id="edit-description"
                      value={editingProduct.description}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          description: e.target.value,
                        })
                      }
                      placeholder="Enter product description"
                      className="w-full min-h-[100px]"
                      required
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="edit-image" className="text-sm font-medium">
                      Product Image
                    </Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      {editImage ? (
                        <div className="space-y-4">
                          <img
                            src={URL.createObjectURL(editImage)}
                            alt="Preview"
                            className="mx-auto max-h-48 rounded-lg"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setEditImage(null)}
                            className="mt-2"
                          >
                            Change Image
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {editingProduct.images &&
                            editingProduct.images[0] && (
                              <img
                                src={editingProduct.images[0]}
                                alt="Current"
                                className="mx-auto max-h-48 rounded-lg"
                              />
                            )}
                          <Input
                            id="edit-image"
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              setEditImage(
                                e.target.files ? e.target.files[0] : null
                              )
                            }
                            className="hidden"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                              document.getElementById("edit-image")?.click()
                            }
                          >
                            Select New Image
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-4 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowEditProduct(false);
                      setEditingProduct(null);
                      setEditImage(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {loading ? "Processing..." : "Update Product"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MyStore;
