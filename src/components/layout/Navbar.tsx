import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Menu, X, UserRound } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const Navbar = () => {
  const { totalItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-fashion-DEFAULT text-2xl font-bold">
            StyleShare
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-fashion-DEFAULT hover:text-fashion-accent transition">
              Home
            </Link>
            <Link to="/shops" className="text-fashion-DEFAULT hover:text-fashion-accent transition">
              Shops
            </Link>
            <Link to="/products" className="text-fashion-DEFAULT hover:text-fashion-accent transition">
              Products
            </Link>
            <Link to="/my-rentals" className="text-fashion-DEFAULT hover:text-fashion-accent transition">
              My Rentals
            </Link>
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
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full focus-visible:ring-2 focus-visible:ring-fashion-accent transition hover:cursor-pointer"
                >
                  <Avatar className="h-8 w-8 border border-gray-300">
                    <AvatarFallback className="bg-fashion-accent text-white text-sm">
                      JD
                    </AvatarFallback>
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
                    to="/my-rentals"
                    className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-blue-400 hover:text-white transition-colors w-full cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    My Rentals
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="my-1" />

                <DropdownMenuItem asChild>
                  <Link
                    to="/login"
                    className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-blue-400 transition-colors w-full cursor-pointer"
                  >
                    <UserRound className="w-4 h-4" />
                    Sign In
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-fashion-DEFAULT" 
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
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
                  to="/shops" 
                  className="block text-fashion-DEFAULT hover:text-fashion-accent"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Shops
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
                  to="/settings" 
                  className="block text-fashion-DEFAULT hover:text-fashion-accent"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Settings
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
};