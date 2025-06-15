import { Toaster as Sonner } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import MyRentals from "./pages/MyRentals";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
// import Chat from "./pages/Chat";
import Stores from "./pages/Stores";
import StoreDetail from "./pages/StoreDetail";
import { TooltipProvider } from "./components/ui/tooltip";
import { CartProvider } from "./components/contexts/CartContext";
import { RentalProvider } from "./components/contexts/RentalContext";
import { AuthProvider } from "./components/contexts/AuthContext";
import { UserProvider } from "./components/contexts/UserContext";
import Settings from "./pages/Setting";
import MyStore from "./pages/MyStore";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancel from "./pages/PaymentCancel";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import GoogleCallback from "./pages/GoogleCallback";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import ProductList from "./pages/admin/ProductList";
import RentalForms from "./pages/admin/RentalForms";
import Users from "./pages/admin/Users";
import RentalShop from "./pages/admin/RentalShop";
import Revenue from "./pages/admin/Revenue";
import SystemSettings from "./pages/admin/SystemSettings";

const queryClient = new QueryClient();

const App = () => (
    <QueryClientProvider client={queryClient}>
        <BrowserRouter>
            <TooltipProvider>
                <AuthProvider>
                    <UserProvider>
                        {/* <SocketProvider> */}
                        <CartProvider>
                            <RentalProvider>
                                <Routes>
                                    <Route path="/" element={<Home />} />
                                    <Route
                                        path="/products"
                                        element={<Products />}
                                    />
                                    <Route
                                        path="/products/:productId"
                                        element={<ProductDetail />}
                                    />
                                    <Route
                                        path="/stores"
                                        element={<Stores />}
                                    />
                                    <Route
                                        path="/stores/:storeId"
                                        element={<StoreDetail />}
                                    />
                                    <Route path="/cart" element={<Cart />} />
                                    <Route
                                        path="/my-rentals"
                                        element={<MyRentals />}
                                    />
                                    <Route path="/login" element={<Login />} />
                                    <Route
                                        path="/register"
                                        element={<Register />}
                                    />
                                    <Route
                                        path="/settings"
                                        element={<Settings />}
                                    />
                                    {/* <Route path="/chat" element={<Chat />} /> */}
                                    <Route
                                        path="/my-store"
                                        element={<MyStore />}
                                    />
                                    <Route
                                        path="/payment-success"
                                        element={<PaymentSuccess />}
                                    />
                                    <Route
                                        path="/payment-cancel"
                                        element={<PaymentCancel />}
                                    />
                                    <Route
                                        path="/forgot-password"
                                        element={<ForgotPassword />}
                                    />
                                    <Route
                                        path="/reset-password/:token"
                                        element={<ResetPassword />}
                                    />
                                    <Route
                                        path="/auth/google/callback"
                                        element={<GoogleCallback />}
                                    />
                                    <Route
                                        path="/auth/google"
                                        element={<GoogleCallback />}
                                    />

                                    <Route
                                        path="/admin"
                                        element={<AdminLayout />}
                                    >
                                        <Route
                                            path="dashboard"
                                            element={<Dashboard />}
                                        />
                                        <Route
                                            path="products"
                                            element={<ProductList />}
                                        />
                                        <Route
                                            path="rental-forms"
                                            element={<RentalForms />}
                                        />
                                        <Route
                                            path="users"
                                            element={<Users />}
                                        />
                                        <Route
                                            path="rental-shop"
                                            element={<RentalShop />}
                                        />
                                        <Route
                                            path="revenue"
                                            element={<Revenue />}
                                        />
                                        <Route
                                            path="settings"
                                            element={<SystemSettings />}
                                        />
                                    </Route>
                                    <Route path="*" element={<NotFound />} />
                                </Routes>
                            </RentalProvider>
                        </CartProvider>
                        {/* </SocketProvider> */}
                    </UserProvider>
                </AuthProvider>
            </TooltipProvider>
        </BrowserRouter>
        <Sonner />
    </QueryClientProvider>
);

export default App;
