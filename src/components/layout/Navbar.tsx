import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  Menu,
  X,
  UserRound,
  LogOut,
  MessageCircle,
} from "lucide-react";
import { useCart } from "@/components/contexts/CartContext";
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

export const Navbar = () => {
  const { totalItems } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  console.log(user);

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
        <div className="flex items-center justify-between">
          <Link to="/" className="text-fashion-DEFAULT text-2xl font-bold">
            Fasent
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-fashion-DEFAULT hover:text-fashion-accent transition"
            >
              Home
            </Link>
            <Link
              to="/stores"
              className="text-fashion-DEFAULT hover:text-fashion-accent transition"
            >
              Stores
            </Link>
            <Link
              to="/products"
              className="text-fashion-DEFAULT hover:text-fashion-accent transition"
            >
              Products
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to="/my-rentals"
                  className="text-fashion-DEFAULT hover:text-fashion-accent transition"
                >
                  My Rentals
                </Link>
                <Link
                  to="/chat"
                  className="text-fashion-DEFAULT hover:text-fashion-accent transition"
                >
                  Chat
                </Link>
              </>
            )}
          </nav>

          {/* Cart and User Icons */}
          <div className="flex items-center space-x-4">
            <Link to="/cart" className="relative">
              <ShoppingBag className="h-6 w-6 text-fashion-DEFAULT" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-fashion-accent text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full focus-visible:ring-2 focus-visible:ring-fashion-accent transition"
                  >
                    <Avatar className="h-8 w-8 border border-gray-300">
                      {user?.avatar ? (
                        <AvatarImage
                          src={user.avatar}
                          alt={user.username}
                        />
                      ) : (
                        <AvatarFallback className="bg-fashion-accent text-white text-sm">
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
                      className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-blue-400 hover:text-white transition-colors w-full cursor-pointer"
                    >
                      <UserRound className="w-4 h-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link
                      to="/chat"
                      className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-blue-400 hover:text-white transition-colors w-full cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Chat
                    </Link>
                  </DropdownMenuItem>

                  {user?.role === "CUSTOMER" && (
                    <DropdownMenuItem asChild>
                      <Link
                        to="/my-rentals"
                        className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-blue-400 hover:text-white transition-colors w-full cursor-pointer"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        My Rentals
                      </Link>
                    </DropdownMenuItem>
                  )}

                  {user?.role === "STORE" && (
                    <DropdownMenuItem asChild>
                      <Link
                        to="/my-rentals"
                        className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-blue-400 hover:text-white transition-colors w-full cursor-pointer"
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
                  className="border-sidebar-border"
                >
                  Sign In
                </Button>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-fashion-DEFAULT"
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
          <nav className="md:hidden mt-4 pb-4">
            <ul className="flex flex-col space-y-4">
              <li>
                <Link
                  to="/"
                  className="block text-fashion-DEFAULT hover:text-fashion-accent"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/stores"
                  className="block text-fashion-DEFAULT hover:text-fashion-accent"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Stores
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  className="block text-fashion-DEFAULT hover:text-fashion-accent"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Products
                </Link>
              </li>
              {isAuthenticated && (
                <>
                  <li>
                    <Link
                      to="/my-rentals"
                      className="block text-fashion-DEFAULT hover:text-fashion-accent"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Rentals
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/chat"
                      className="block text-fashion-DEFAULT hover:text-fashion-accent"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Chat
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/settings"
                      className="block text-fashion-DEFAULT hover:text-fashion-accent"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Settings
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
};
