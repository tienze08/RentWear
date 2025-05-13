
import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";

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

          {/* Cart Icon */}
          <div className="flex items-center">
            <Link to="/cart" className="relative">
              <ShoppingBag className="h-6 w-6 text-fashion-DEFAULT" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-fashion-accent text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            
            {/* Mobile Menu Button */}
            <button 
              className="ml-4 md:hidden text-fashion-DEFAULT" 
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
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
};
