import { useEffect, useState } from "react";
import {
    Search,
    Filter,
    Store as StoreIcon,
    MapPin,
    MoreHorizontal,
    Plus,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import axiosInstance from "@/lib/axiosInstance";
import ApiConstants from "@/lib/api";
import { User } from "@/lib/types";

const RentalShop = () => {
    const [stores, setStores] = useState<User[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    console.log("Stores", stores);

    useEffect(() => {
        const fetchStores = async () => {
            try {
                const response = await axiosInstance.get(ApiConstants.STORES);
                const usersWithStores = response.data;

                setStores(usersWithStores);
            } catch (error) {
                console.error("Error fetching stores:", error);
            }
        };

        fetchStores();
    }, []);

    const filteredStores = stores.filter((shop) =>
        shop.storeInfo?.storeName
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
    );

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "active":
                return "border-green-500 text-green-600 bg-green-50";
            case "pending":
                return "border-yellow-500 text-yellow-600 bg-yellow-50";
            case "inactive":
                return "border-red-500 text-red-600 bg-red-50";
            default:
                return "border-gray-500 text-gray-600 bg-gray-50";
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Rental Shops
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Manage partner stores and suppliers
                    </p>
                </div>
                <Button className="w-full sm:w-auto">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Shop
                </Button>
            </div>

            <Card className="border-b border-sidebar-border">
                <div className="p-6">
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                        <div className="relative w-full sm:max-w-xs">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Search shops..."
                                className="pl-10"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Button
                            variant="outline"
                            className="w-full sm:w-auto flex items-center"
                        >
                            <Filter className="h-4 w-4 mr-2" />
                            Filter
                        </Button>
                    </div>

                    <div className="mt-6 overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-b border-sidebar-border">
                                    <TableHead>Shop Name</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Owner</TableHead>
                                    <TableHead>Products</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredStores.map((shop) => (
                                    <TableRow
                                        key={shop.username}
                                        className="border-b border-sidebar-border"
                                    >
                                        <TableCell>
                                            <div className="flex items-center">
                                                <div className="h-8 w-8 rounded bg-blue-100 flex items-center justify-center mr-3">
                                                    <StoreIcon className="h-4 w-4 text-blue-600" />
                                                </div>
                                                <span className="font-medium">
                                                    {shop.storeInfo?.storeName}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center">
                                                <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                                                {shop.address}
                                            </div>
                                        </TableCell>
                                        <TableCell>{shop.username}</TableCell>
                                        <TableCell>{shop.phone}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={getStatusColor(
                                                    shop.status
                                                )}
                                            >
                                                {shop.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        className="h-8 w-8 p-0"
                                                    >
                                                        <span className="sr-only">
                                                            Open menu
                                                        </span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>
                                                        Actions
                                                    </DropdownMenuLabel>
                                                    <DropdownMenuItem>
                                                        View details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        Edit shop
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        View products
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    {shop.status ===
                                                    "ACTIVE" ? (
                                                        <DropdownMenuItem className="text-yellow-600">
                                                            Deactivate shop
                                                        </DropdownMenuItem>
                                                    ) : (
                                                        <DropdownMenuItem className="text-green-600">
                                                            Activate shop
                                                        </DropdownMenuItem>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        {filteredStores.length === 0 && (
                            <div className="text-center py-10">
                                <p className="text-gray-500">No shops found</p>
                            </div>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default RentalShop;
