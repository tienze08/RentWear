import { useState } from "react";
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

const forms = [
    {
        id: 1,
        customer: "John Smith",
        items: 3,
        total: "$245.00",
        status: "Active",
        startDate: "May 15, 2025",
        endDate: "May 20, 2025",
    },
    {
        id: 2,
        customer: "Emma Wilson",
        items: 2,
        total: "$125.00",
        status: "Pending",
        startDate: "May 18, 2025",
        endDate: "May 19, 2025",
    },
    {
        id: 3,
        customer: "Michael Brown",
        items: 1,
        total: "$75.00",
        status: "Completed",
        startDate: "May 10, 2025",
        endDate: "May 13, 2025",
    },
    {
        id: 4,
        customer: "Sophia Garcia",
        items: 4,
        total: "$310.00",
        status: "Active",
        startDate: "May 14, 2025",
        endDate: "May 21, 2025",
    },
    {
        id: 5,
        customer: "William Johnson",
        items: 2,
        total: "$180.00",
        status: "Cancelled",
        startDate: "May 19, 2025",
        endDate: "May 22, 2025",
    },
    {
        id: 6,
        customer: "Olivia Martinez",
        items: 3,
        total: "$220.00",
        status: "Pending",
        startDate: "May 20, 2025",
        endDate: "May 25, 2025",
    },
    {
        id: 7,
        customer: "James Miller",
        items: 1,
        total: "$95.00",
        status: "Completed",
        startDate: "May 12, 2025",
        endDate: "May 13, 2025",
    },
    {
        id: 8,
        customer: "Ava Davis",
        items: 2,
        total: "$150.00",
        status: "Active",
        startDate: "May 16, 2025",
        endDate: "May 18, 2025",
    },
];

const RentalForms = () => {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredForms = forms.filter(
        (form) =>
            form.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
            form.status.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "active":
                return "border-green-500 text-green-600 bg-green-50";
            case "pending":
                return "border-yellow-500 text-yellow-600 bg-yellow-50";
            case "completed":
                return "border-blue-500 text-blue-600 bg-blue-50";
            case "cancelled":
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
                                placeholder="Search forms..."
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
                                    <TableHead>Items</TableHead>
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
                                {filteredForms.map((form) => (
                                    <TableRow
                                        key={form.id}
                                        className="border-b border-sidebar-border hover:bg-gray-50"
                                    >
                                        <TableCell className="font-medium">
                                            {form.customer}
                                        </TableCell>
                                        <TableCell>{form.items}</TableCell>
                                        <TableCell>{form.total}</TableCell>
                                        <TableCell>{form.startDate}</TableCell>
                                        <TableCell>{form.endDate}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={getStatusColor(
                                                    form.status
                                                )}
                                            >
                                                {form.status}
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

                        {filteredForms.length === 0 && (
                            <div className="text-center py-10">
                                <p className="text-gray-500">No forms found</p>
                            </div>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default RentalForms;
