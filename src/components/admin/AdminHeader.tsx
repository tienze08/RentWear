import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface HeaderProps {}

const AdminHeader = ({}: HeaderProps) => {
    return (
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
            <div className="flex-1 max-w-md">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        type="text"
                        placeholder="Search..."
                        className="pl-10 h-9 bg-gray-50 border-gray-200 focus:bg-white"
                    />
                </div>
            </div>
            <div className="flex items-center gap-4">
                <button className="relative p-2 rounded-full hover:bg-gray-100">
                    <Bell className="h-5 w-5 text-gray-500" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
            </div>
        </header>
    );
};

export default AdminHeader;
