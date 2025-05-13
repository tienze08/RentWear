
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-fashion-light text-fashion-DEFAULT py-12 border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">StyleShare</h3>
            <p className="text-fashion-muted">
              Rent designer clothes from multiple shops at affordable prices.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-fashion-muted hover:text-fashion-accent transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/shops" className="text-fashion-muted hover:text-fashion-accent transition">
                  Shops
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-fashion-muted hover:text-fashion-accent transition">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/my-rentals" className="text-fashion-muted hover:text-fashion-accent transition">
                  My Rentals
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products?category=Dresses" className="text-fashion-muted hover:text-fashion-accent transition">
                  Dresses
                </Link>
              </li>
              <li>
                <Link to="/products?category=Tops" className="text-fashion-muted hover:text-fashion-accent transition">
                  Tops
                </Link>
              </li>
              <li>
                <Link to="/products?category=Bottoms" className="text-fashion-muted hover:text-fashion-accent transition">
                  Bottoms
                </Link>
              </li>
              <li>
                <Link to="/products?category=Outerwear" className="text-fashion-muted hover:text-fashion-accent transition">
                  Outerwear
                </Link>
              </li>
              <li>
                <Link to="/products?category=Accessories" className="text-fashion-muted hover:text-fashion-accent transition">
                  Accessories
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <address className="not-italic text-fashion-muted">
              <p>123 Fashion Street</p>
              <p>Style City, SC 12345</p>
              <p className="mt-2">Email: info@styleshare.com</p>
              <p>Phone: (123) 456-7890</p>
            </address>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-fashion-muted">
          <p>&copy; {new Date().getFullYear()} StyleShare. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
