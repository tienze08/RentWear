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
          const paidForThisStore = paymentsResp.data.some(
            (p: { rentals: { storeId: string }[]; status: string }) =>
              p.rentals.some(
                (r: { storeId: string }) =>
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
            The store you&apos;re looking for doesn&apos;t exist or has been
            removed.
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="container mx-auto px-4 py-8">
          {/* Store Info */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-10 mb-12 border border-white/20">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
              <div className="relative">
                <div className="w-32 h-32 rounded-3xl overflow-hidden flex-shrink-0 border-4 border-white shadow-xl">
                  <img
                    src={store.logoUrl}
                    alt={store.storeName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-green-400 to-green-500 rounded-full border-4 border-white"></div>
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-700 to-blue-600 bg-clip-text text-transparent mb-3">
                      {store.storeName}
                    </h1>
                    <p className="text-gray-600 text-lg leading-relaxed mb-4">
                      {store.description}
                    </p>
                    {store.featured && (
                      <span className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 px-4 py-2 rounded-full text-sm font-semibold border border-amber-200">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        Cửa Hàng Nổi Bật
                      </span>
                    )}

                    {user?.role === "CUSTOMER" && (
                      <div className="mt-6 flex gap-4">
                        <button
                          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-semibold shadow-lg transform hover:scale-105"
                          onClick={async () => {
                            await startConversation(store._id);
                            setShowChat(true);
                          }}
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a9.863 9.863 0 01-4.906-1.289L3 21l1.289-5.094A9.863 9.863 0 013 12a8 8 0 018-8s8 3.582 8 8z"
                            />
                          </svg>
                          Nhắn Tin
                        </button>
                      </div>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowReportModal(true)}
                    className="flex items-center gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200 rounded-xl transition-all duration-300"
                  >
                    <Flag className="w-4 h-4" />
                    Báo Cáo
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-700 to-blue-600 bg-clip-text text-transparent mb-8 text-center">
              Sản Phẩm Từ {store.storeName}
            </h2>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="transform hover:scale-105 transition-all duration-300"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 mb-16">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-xl border border-white/20 max-w-lg mx-auto">
                <div className="w-20 h-20 bg-gradient-to-r from-gray-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-10 h-10 text-gray-500"
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
                  Chưa có sản phẩm
                </h3>
                <p className="text-gray-600 mb-8">
                  Cửa hàng này hiện chưa có sản phẩm nào để cho thuê.
                </p>
                <Link
                  to="/stores"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-semibold transform hover:scale-105"
                >
                  <svg
                    className="w-5 h-5"
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
                  Khám Phá Cửa Hàng Khác
                </Link>
              </div>
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
            reporterName={user?.username || "Current User"}
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
      </div>
    </Layout>
  );
};

export default StoreDetail;
