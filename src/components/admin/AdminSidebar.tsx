
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Package2, 
  FileText, 
  Users, 
  Store, 
  TrendingUp, 
  Settings,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const menuItems = [
  { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Product List", path: "/admin/products", icon: Package2 },
  { name: "Rental Forms", path: "/admin/rental-forms", icon: FileText },
  { name: "Users", path: "/admin/users", icon: Users },
  { name: "Rental Shop", path: "/admin/rental-shop", icon: Store },
  { name: "Revenue", path: "/admin/revenue", icon: TrendingUp },
  { name: "System Settings", path: "/admin/settings", icon: Settings },
];

const AdminSidebar = ({ isOpen, toggleSidebar }: SidebarProps) => {
  const location = useLocation();

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-white border-r border-gray-200 transition-all duration-300",
        isOpen ? "w-64" : "w-20"
      )}
    >
      <div className="flex flex-col h-full">
        <div className={cn(
          "flex items-center h-16 px-4 border-b border-gray-200",
          isOpen ? "justify-between" : "justify-center"
        )}>
          {isOpen && <h1 className="text-xl font-semibold text-gray-800">Admin Panel</h1>}
          <button 
            onClick={toggleSidebar}
            className="p-2 rounded-md hover:bg-gray-100 text-gray-500"
          >
            {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>
        <nav className="flex-grow overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center p-3 text-gray-700 rounded-md hover:bg-blue-50 hover:text-blue-700 transition-all",
                    location.pathname === item.path && "bg-blue-50 text-blue-700",
                    !isOpen && "justify-center"
                  )}
                >
                  <item.icon className={cn("h-5 w-5", !isOpen && "mx-auto")} />
                  {isOpen && <span className="ml-3 font-medium">{item.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-200">
          {isOpen ? (
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-700 font-medium">A</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">Admin User</p>
                <p className="text-xs text-gray-500">admin@example.com</p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-700 font-medium">A</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
