import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  ShoppingBag,
  Menu,
  X,
  UserRound,
  LogOut,
  MessageCircle,
} from "lucide-react";
import { useAuth } from "@/components/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRental } from "@/hooks/useRental";

export const Navbar = () => {
  const { totalItems } = useRental();
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between ">
          <Link to="/" className="text-blueberry text-2xl font-bold">
            Fasent
          </Link>

          {/* Desktop Navigation */}
          <nav className="text-blueberry hidden md:flex items-center space-x-8 font-semibold">
            <Link
              to="/"
              className={`hover:text-strawberry transition ${
                isActive("/") ? "text-strawberry" : ""
              }`}
            >
              Home
            </Link>
            <Link
              to="/stores"
              className={`hover:text-strawberry transition ${
                isActive("/stores") ? "text-strawberry" : ""
              }`}
            >
              Stores
            </Link>
            <Link
              to="/products"
              className={`hover:text-strawberry transition ${
                isActive("/products") ? "text-strawberry" : ""
              }`}
            >
              Products
            </Link>

            {user?.role === "STORE" && (
              <Link
                to="/my-store"
                className={`hover:text-strawberry transition ${
                  isActive("/my-store") ? "text-strawberry" : ""
                }`}
              >
                My Store
              </Link>
            )}

            {isAuthenticated && user?.role === "CUSTOMER" && (
              <>
                <Link
                  to="/my-rentals"
                  className={`hover:text-strawberry transition ${
                    isActive("/my-rentals") ? "text-strawberry" : ""
                  }`}
                >
                  My Rentals
                </Link>
                <Link
                  to="/chat"
                  className={`hover:text-strawberry transition ${
                    isActive("/chat") ? "text-strawberry" : ""
                  }`}
                >
                  Chat
                </Link>
              </>
            )}
          </nav>

          {/* Cart and User Icons */}
          <div className="flex items-center space-x-4">
            {user?.role === "CUSTOMER" && (
              <Link to="/cart" className="relative">
                <ShoppingBag className="h-6 w-6 text-blueberry" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-blueberry text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>
            )}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full focus-visible:ring-2 focus-visible:ring-blueberry transition hover:cursor-pointer"
                  >
                    <Avatar className="h-8 w-8 border border-gray-300">
                      {user?.avatar ? (
                        <AvatarImage src={user.avatar} alt={user.username} />
                      ) : (
                        <AvatarFallback className="bg-blueberry text-white text-sm">
                          {getInitials(user?.username || "")}
                        </AvatarFallback>
                      )}
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="w-52 mt-2 rounded-xl border border-gray-200 bg-white shadow-lg p-1"
                >
                  <DropdownMenuItem asChild>
                    <Link
                      to="/settings"
                      className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-blueberry hover:bg-blue-100 transition-colors w-full cursor-pointer"
                    >
                      <UserRound className="w-4 h-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link
                      to="/chat"
                      className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-blueberry hover:bg-blue-100 transition-colors w-full cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Chat
                    </Link>
                  </DropdownMenuItem>

                  {user?.role === "CUSTOMER" && (
                    <DropdownMenuItem asChild>
                      <Link
                        to="/my-rentals"
                        className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-blueberry hover:bg-blue-100 transition-colors w-full cursor-pointer"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        My Rentals
                      </Link>
                    </DropdownMenuItem>
                  )}

                  {user?.role === "STORE" && (
                    <DropdownMenuItem asChild>
                      <Link
                        to="/my-store"
                        className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-blueberry hover:bg-blue-100 transition-colors w-full cursor-pointer"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        My Store
                      </Link>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuSeparator className="my-1" />

                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-red-600 hover:bg-red-50 transition-colors w-full cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-sidebar-border bg-blueberry text-white hover:bg-blue-950 hover:cursor-pointer"
                >
                  Sign In
                </Button>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-blueberry"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav
            className={`md:hidden ${
              isMenuOpen ? "block" : "hidden"
            } absolute top-full left-0 right-0 bg-white border-b border-gray-200 py-4`}
          >
            <div className="container mx-auto px-4 space-y-4">
              <Link
                to="/"
                className={`block text-blueberry hover:text-strawberry ${
                  isActive("/") ? "text-strawberry" : ""
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/stores"
                className={`block text-blueberry hover:text-strawberry ${
                  isActive("/stores") ? "text-strawberry" : ""
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Stores
              </Link>
              <Link
                to="/products"
                className={`block text-blueberry hover:text-strawberry ${
                  isActive("/products") ? "text-strawberry" : ""
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              {user?.role === "STORE" && (
                <Link
                  to="/my-store"
                  className={`block text-blueberry hover:text-strawberry ${
                    isActive("/my-store") ? "text-strawberry" : ""
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Store
                </Link>
              )}
              {isAuthenticated && user?.role === "CUSTOMER" && (
                <>
                  <Link
                    to="/my-rentals"
                    className={`block text-blueberry hover:text-strawberry ${
                      isActive("/my-rentals") ? "text-strawberry" : ""
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Rentals
                  </Link>
                  <Link
                    to="/chat"
                    className={`block text-blueberry hover:text-strawberry ${
                      isActive("/chat") ? "text-strawberry" : ""
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Chat
                  </Link>
                </>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};
