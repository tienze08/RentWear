import { useState } from "react";
import { Search, Filter, User, UserPlus, MoreHorizontal } from "lucide-react";
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

const users = [
    {
        id: 1,
        name: "John Smith",
        email: "john@example.com",
        role: "Customer",
        status: "Active",
        joinDate: "Mar 15, 2025",
    },
    {
        id: 2,
        name: "Emma Wilson",
        email: "emma@example.com",
        role: "Customer",
        status: "Active",
        joinDate: "Apr 2, 2025",
    },
    {
        id: 3,
        name: "Michael Brown",
        email: "michael@example.com",
        role: "Staff",
        status: "Active",
        joinDate: "Jan 10, 2025",
    },
    {
        id: 4,
        name: "Sophia Garcia",
        email: "sophia@example.com",
        role: "Customer",
        status: "Inactive",
        joinDate: "Feb 14, 2025",
    },
    {
        id: 5,
        name: "William Johnson",
        email: "william@example.com",
        role: "Admin",
        status: "Active",
        joinDate: "May 1, 2024",
    },
    {
        id: 6,
        name: "Olivia Martinez",
        email: "olivia@example.com",
        role: "Partner",
        status: "Active",
        joinDate: "Dec 20, 2024",
    },
    {
        id: 7,
        name: "James Miller",
        email: "james@example.com",
        role: "Customer",
        status: "Blocked",
        joinDate: "Apr 12, 2025",
    },
    {
        id: 8,
        name: "Ava Davis",
        email: "ava@example.com",
        role: "Customer",
        status: "Active",
        joinDate: "Mar 16, 2025",
    },
];

const Users = () => {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredUsers = users.filter(
        (user) =>
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.role.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "active":
                return "border-green-500 text-green-600 bg-green-50";
            case "inactive":
                return "border-yellow-500 text-yellow-600 bg-yellow-50";
            case "blocked":
                return "border-red-500 text-red-600 bg-red-50";
            default:
                return "border-gray-500 text-gray-600 bg-gray-50";
        }
    };

    const getRoleBadge = (role: string) => {
        switch (role.toLowerCase()) {
            case "admin":
                return "bg-blue-100 text-blue-800";
            case "staff":
                return "bg-purple-100 text-purple-800";
            case "partner":
                return "bg-green-100 text-green-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Users</h1>
                    <p className="text-gray-500 mt-1">
                        Manage users and permissions
                    </p>
                </div>
                <Button className="w-full sm:w-auto">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add User
                </Button>
            </div>

            <Card className="border-b border-sidebar-border">
                <div className="p-6">
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                        <div className="relative w-full sm:max-w-xs">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Search users..."
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
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Join Date</TableHead>
                                    <TableHead className="text-right">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUsers.map((user) => (
                                    <TableRow
                                        key={user.id}
                                        className="border-b border-sidebar-border"
                                    >
                                        <TableCell>
                                            <div className="flex items-center">
                                                <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                                                    <User className="h-4 w-4 text-gray-500" />
                                                </div>
                                                <span className="font-medium">
                                                    {user.name}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            <span
                                                className={`text-xs px-2 py-1 rounded ${getRoleBadge(
                                                    user.role
                                                )}`}
                                            >
                                                {user.role}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={getStatusColor(
                                                    user.status
                                                )}
                                            >
                                                {user.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{user.joinDate}</TableCell>
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
                                                        View profile
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    {user.status ===
                                                    "Active" ? (
                                                        <DropdownMenuItem className="text-yellow-600">
                                                            Deactivate user
                                                        </DropdownMenuItem>
                                                    ) : (
                                                        <DropdownMenuItem className="text-green-600">
                                                            Activate user
                                                        </DropdownMenuItem>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        {filteredUsers.length === 0 && (
                            <div className="text-center py-10">
                                <p className="text-gray-500">No users found</p>
                            </div>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default Users;
