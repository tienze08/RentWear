import { useState } from "react";
import { Plus, Search, Filter, MoreHorizontal } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const products = [
    {
        id: 1,
        name: "Premium Mountain Bike",
        category: "Bikes",
        stock: 24,
        price: "$120/day",
        status: "Available",
    },
    {
        id: 2,
        name: "Road Bicycle",
        category: "Bikes",
        stock: 15,
        price: "$85/day",
        status: "Available",
    },
    {
        id: 3,
        name: "Camping Tent (4-person)",
        category: "Camping",
        stock: 8,
        price: "$45/day",
        status: "Low Stock",
    },
    {
        id: 4,
        name: "Backpack 65L",
        category: "Hiking",
        stock: 12,
        price: "$25/day",
        status: "Available",
    },
    {
        id: 5,
        name: "Snowboard (Advanced)",
        category: "Winter Sports",
        stock: 0,
        price: "$95/day",
        status: "Out of Stock",
    },
    {
        id: 6,
        name: "Kayak",
        category: "Water Sports",
        stock: 5,
        price: "$75/day",
        status: "Low Stock",
    },
    {
        id: 7,
        name: "Climbing Gear Set",
        category: "Climbing",
        stock: 7,
        price: "$55/day",
        status: "Available",
    },
    {
        id: 8,
        name: "Fishing Rod Pro",
        category: "Fishing",
        stock: 18,
        price: "$35/day",
        status: "Available",
    },
];

const ProductList = () => {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredProducts = products.filter(
        (product) =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Product List
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Manage your rental inventory
                    </p>
                </div>
                <Button className="w-full sm:w-auto">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                </Button>
            </div>

            <Card className="border-sidebar-border">
                <div className="p-6">
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                        <div className="relative w-full sm:max-w-xs">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Search products..."
                                className="pl-10"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Button
                            variant="outline"
                            className="w-full sm:w-auto flex items-center border-sidebar-border"
                        >
                            <Filter className="h-4 w-4 mr-2" />
                            Filter
                        </Button>
                    </div>

                    <div className="mt-6 overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-b border-sidebar-border">
                                    <TableHead>Name</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Stock</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredProducts.map((product) => (
                                    <TableRow
                                        key={product.id}
                                        className="border-b border-sidebar-border"
                                    >
                                        <TableCell className="font-medium">
                                            {product.name}
                                        </TableCell>
                                        <TableCell>
                                            {product.category}
                                        </TableCell>
                                        <TableCell>{product.stock}</TableCell>
                                        <TableCell>{product.price}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={
                                                    product.status ===
                                                    "Available"
                                                        ? "border-green-500 text-green-600 bg-green-50"
                                                        : product.status ===
                                                          "Low Stock"
                                                        ? "border-yellow-500 text-yellow-600 bg-yellow-50"
                                                        : "border-red-500 text-red-600 bg-red-50"
                                                }
                                            >
                                                {product.status}
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
                                                        Edit product
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-red-600">
                                                        Delete product
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        {filteredProducts.length === 0 && (
                            <div className="text-center py-10">
                                <p className="text-gray-500">
                                    No products found
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default ProductList;
