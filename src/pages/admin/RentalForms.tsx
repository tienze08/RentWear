import { useEffect, useState } from "react";
import { Search, Filter, FileText, MoreHorizontal } from "lucide-react";
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import axiosInstance from "@/lib/axiosInstance";

interface Rental {
    _id: string;
    productId: string;
    customerId: { _id: string; username: string };
    storeId: string;
    rentalStart: string;
    rentalEnd: string;
    totalPrice: number;
    depositPaid: boolean;
    status: string;
    createdAt: string;
    updatedAt: string;
}

const RentalForms = () => {
    const [rentals, setRentals] = useState<Rental[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchRentals = async () => {
            try {
                const res = await axiosInstance.get("/rentals");
                setRentals(res.data);
            } catch (err) {
                console.error("Failed to fetch rentals", err);
            }
        };
        fetchRentals();
    }, []);

    console.log("Rentals:", rentals);

    const filteredRentals = rentals.filter(
        (rental) =>
            rental.customerId?.username
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            rental.status.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "active":
                return "border-green-500 text-green-600 bg-green-50";
            case "pending":
                return "border-yellow-500 text-yellow-600 bg-yellow-50";
            case "completed":
                return "border-blue-500 text-blue-600 bg-blue-50";
            case "canceled":
                return "border-red-500 text-red-600 bg-red-50";
            default:
                return "border-gray-500 text-gray-600 bg-gray-50";
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">
                    Rental Forms
                </h1>
                <p className="text-gray-500 mt-1">
                    Manage all rental agreements and forms
                </p>
            </div>

            <Card className="border-b border-sidebar-border">
                <div className="p-6">
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                        <div className="relative w-full sm:max-w-xs">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Search by username or status..."
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
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Total</TableHead>
                                    <TableHead>Start Date</TableHead>
                                    <TableHead>End Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredRentals.map((rental) => (
                                    <TableRow
                                        key={rental._id}
                                        className="border-b border-sidebar-border hover:bg-gray-50"
                                    >
                                        <TableCell className="font-medium">
                                            {rental.customerId?.username ||
                                                "Unknown"}
                                        </TableCell>
                                        <TableCell>
                                            ${rental.totalPrice}
                                        </TableCell>
                                        <TableCell>
                                            {new Date(
                                                rental.rentalStart
                                            ).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            {new Date(
                                                rental.rentalEnd
                                            ).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={getStatusColor(
                                                    rental.status
                                                )}
                                            >
                                                {rental.status.charAt(0) +
                                                    rental.status
                                                        .slice(1)
                                                        .toLowerCase()}
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
                                                        <FileText className="h-4 w-4 mr-2" />
                                                        View form
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        Edit details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-red-600">
                                                        Cancel rental
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        {filteredRentals.length === 0 && (
                            <div className="text-center py-10">
                                <p className="text-gray-500">
                                    No rentals found
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default RentalForms;
