import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { ProductCard } from "@/components/product/ProductCard";
import { Product, Store } from "@/lib/types";
import ApiConstants from "@/lib/api";
import axiosInstance from "@/lib/axiosInstance";
import { useAuth } from "@/components/contexts/AuthContext";
import { FeedbackSection } from "@/components/feedback/FeedbackSection";
import { ReportModal } from "@/components/report/ReportModel";
import { Button } from "@/components/ui/button";
import { Flag } from "lucide-react";
import { useChat } from "@/components/contexts/ChatContext";
import { ChatWindow } from "@/components/chat/ChatWindow";

const StoreDetail = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const [store, setStore] = useState<Store | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasPayment, setHasPayment] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const { user } = useAuth();
  const { startConversation, activeConversationId } = useChat();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // fetch store info
        const storeResp = await axiosInstance.get(
          ApiConstants.GET_STORE_BY_ID(storeId || "")
        );
        const fetchedStore = {
          ...storeResp.data.storeInfo,
          _id: storeResp.data._id,
        };
        setStore(fetchedStore);

        // fetch products
        const productsResp = await axiosInstance.get(
          ApiConstants.GET_PRODUCTS_OF_STORE(storeId || "")
        );
        setProducts(productsResp.data);

        // check customer rentals/payments
        if (user?._id) {
          const paymentsResp = await axiosInstance.get(
            ApiConstants.GET_CUSTOMER_PAYMENTS(user._id)
          );
          const allRentals = paymentsResp.data.flatMap(
            (p: any) => p.rentals
          );
          const paidForThisStore = paymentsResp.data.some((p: any) =>
            p.rentals.some(
              (r: any) =>
                r.storeId === storeId && p.status === "COMPLETED"
            )
          );
          setHasPayment(paidForThisStore);
        }
      } catch (err) {
        console.error("Error fetching store details:", err);
        setStore(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [storeId, user?._id]);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 flex justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 w-64 bg-gray-200 rounded mb-4" />
            <div className="h-4 w-48 bg-gray-200 rounded" />
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
            The store you&apos;re looking for doesn&apos;t exist or has been removed.
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
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-fashion-DEFAULT mb-2">
                    {store.storeName}
                  </h1>
                  <p className="text-fashion-muted">
                    {store.description}
                  </p>
                  {store.featured && (
                    <span className="mt-3 inline-block bg-dashboard-light-purple text-fashion-accent px-3 py-1 rounded-full text-xs font-medium">
                      Featured Store
                    </span>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowReportModal(true)}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Flag className="w-4 h-4" />
                  Report Shop
                </Button>
              </div>

              {user?.role === "CUSTOMER" && (
                <button
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                  onClick={async () => {
                    await startConversation(store._id);
                    setShowChat(true);
                  }}
                >
                  Nhắn tin với cửa hàng
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Products */}
        <h2 className="text-2xl font-bold text-fashion-DEFAULT mb-6">
          Products from {store.storeName}
        </h2>
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-md mb-12">
            <h3 className="text-xl font-medium mb-2">
              No products available
            </h3>
            <p className="text-fashion-muted">
              This store doesn&apos;t have any products available for rent at the moment.
            </p>
            <Link
              to="/stores"
              className="mt-4 inline-block px-6 py-2 bg-fashion-accent text-white rounded-lg hover:bg-fashion-accent/90 transition"
            >
              Browse Other Stores
            </Link>
          </div>
        )}

        {/* Feedback & Report Modal */}
        <FeedbackSection storeId={store._id} hasPayment={hasPayment} />
        <ReportModal
          isOpen={showReportModal}
          onClose={() => setShowReportModal(false)}
          targetId={store._id}
          targetName={store.storeName}
          targetType="shop"
          reporterType="user"
          reporterName={user?.name || "Current User"}
        />

        {/* Chat Window */}
        {showChat && activeConversationId && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <ChatWindow
              conversationId={activeConversationId}
              onClose={() => setShowChat(false)}
            />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default StoreDetail;
