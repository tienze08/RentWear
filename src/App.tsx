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
import Chat from "./pages/Chat";
import Stores from "./pages/Stores";
import StoreDetail from "./pages/StoreDetail";
import { TooltipProvider } from "./components/ui/tooltip";
import { CartProvider } from "./components/contexts/CartContext";
import { RentalProvider } from "./components/contexts/RentalContext";
import { AuthProvider } from "./components/contexts/AuthContext";
import { UserProvider } from "./components/contexts/UserContext";
import { SocketProvider } from "./components/contexts/SocketContext";
import Settings from "./pages/Setting";

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
                    <Route path="/products" element={<Products />} />
                    <Route
                      path="/products/:productId"
                      element={<ProductDetail />}
                    />
                    <Route path="/stores" element={<Stores />} />
                    <Route path="/stores/:storeId" element={<StoreDetail />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/my-rentals" element={<MyRentals />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/chat" element={<Chat />} />
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
