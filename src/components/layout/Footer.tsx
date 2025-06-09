import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-blueberry text-white py-12 border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">StyleShare</h3>
            <p className="text-white/80">
              Rent designer clothes from multiple stores at affordable prices.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-white/80 hover:text-strawberry transition"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/stores"
                  className="text-white/80 hover:text-strawberry transition"
                >
                  Stores
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  className="text-white/80 hover:text-strawberry transition"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  to="/my-rentals"
                  className="text-white/80 hover:text-strawberry transition"
                >
                  My Rentals
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/products?category=Dresses"
                  className="text-white/80 hover:text-strawberry transition"
                >
                  Dresses
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=Tops"
                  className="text-white/80 hover:text-strawberry transition"
                >
                  Tops
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=Bottoms"
                  className="text-white/80 hover:text-strawberry transition"
                >
                  Bottoms
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=Outerwear"
                  className="text-white/80 hover:text-strawberry transition"
                >
                  Outerwear
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=Accessories"
                  className="text-white/80 hover:text-strawberry transition"
                >
                  Accessories
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <address className="not-italic text-white/80">
              <p>123 Fashion Street</p>
              <p>Style City, SC 12345</p>
              <p className="mt-2">Email: info@styleshare.com</p>
              <p>Phone: (123) 456-7890</p>
            </address>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/80">
          <p>
            &copy; {new Date().getFullYear()} StyleShare. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
