import { useState, useEffect } from "react";
import { getAllUsers } from "@/components/contexts/UserContext";
import {
    User as UserIcon,
    UserPlus,
    MoreHorizontal,
    Search,
    Filter,
} from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import BanConfirmationDialog from "@/components/admin/BanConfirmationDialog";
import { useToast } from "@/hooks/use-toast";

type Complaint = {
    id: number;
    reporter: string;
    reason: string;
    description: string;
    date: string;
    severity: "Low" | "Medium" | "High";
};

const userComplaints: Record<string, Complaint[]> = {
    "1": [
        {
            id: 1,
            reporter: "Store Manager",
            reason: "Inappropriate behavior",
            description:
                "Customer was rude to staff and used offensive language during equipment pickup.",
            date: "2025-06-10",
            severity: "Medium" as const,
        },
        {
            id: 2,
            reporter: "Another Customer",
            reason: "Damaged equipment",
            description:
                "Left rental equipment in poor condition, did not follow return guidelines.",
            date: "2025-06-08",
            severity: "High" as const,
        },
    ],
    "2": [
        {
            id: 3,
            reporter: "System Alert",
            reason: "Multiple late returns",
            description:
                "User has been consistently late with equipment returns, affecting other customers.",
            date: "2025-06-09",
            severity: "Low" as const,
        },
    ],
};

const Users = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [banDialogOpen, setBanDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<{
        id: number;
        name: string;
    } | null>(null);
    const { toast } = useToast();

    const handleBanUser = (reason: string) => {
        if (selectedUser) {
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user.id === selectedUser.id
                        ? { ...user, status: "Banned" }
                        : user
                )
            );
            toast({
                title: "User Banned",
                description: `${selectedUser.name} has been banned. Reason: ${reason}`,
            });
        }
    };

    const handleUnbanUser = (userId: number, userName: string) => {
        setUsers((prevUsers) =>
            prevUsers.map((user) =>
                user.id === userId ? { ...user, status: "Active" } : user
            )
        );
        toast({
            title: "User Unbanned",
            description: `${userName} has been unbanned and reactivated.`,
        });
    };

    const openBanDialog = (userId: number, userName: string) => {
        setSelectedUser({ id: userId, name: userName });
        setBanDialogOpen(true);
    };

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await getAllUsers();
                setUsers(data);
                console.log("Fetched users:", data);
            } catch (error) {
                console.error("Failed to fetch users:", error);
            }
        };

        fetchUsers();
    }, []);

    const filteredUsers = users.filter(
        (user) =>
            (user.name?.toLowerCase() ?? "").includes(
                searchQuery.toLowerCase()
            ) ||
            (user.email?.toLowerCase() ?? "").includes(
                searchQuery.toLowerCase()
            ) ||
            (user.role?.toLowerCase() ?? "").includes(searchQuery.toLowerCase())
    );

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
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
        switch (role?.toLowerCase()) {
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
                                        key={user._id}
                                        className="border-b border-sidebar-border"
                                    >
                                        <TableCell>
                                            <div className="flex items-center">
                                                <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                                                    <UserIcon className="h-4 w-4 text-gray-500" />
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
                                        <TableCell>
                                            {new Date(
                                                user.createdAt
                                            ).toLocaleDateString()}
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
                                                <DropdownMenuContent
                                                    align="end"
                                                    className="bg-white"
                                                >
                                                    <DropdownMenuLabel>
                                                        Actions
                                                    </DropdownMenuLabel>
                                                    <DropdownMenuItem>
                                                        View profile
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    {user.status ===
                                                    "Banned" ? (
                                                        <DropdownMenuItem
                                                            className="text-green-600"
                                                            onClick={() =>
                                                                handleUnbanUser(
                                                                    user.id,
                                                                    user.name
                                                                )
                                                            }
                                                        >
                                                            Unban user
                                                        </DropdownMenuItem>
                                                    ) : (
                                                        <>
                                                            {user.status ===
                                                                "Active" && (
                                                                <DropdownMenuItem className="text-yellow-600">
                                                                    Deactivate
                                                                    user
                                                                </DropdownMenuItem>
                                                            )}
                                                            {user.status ===
                                                                "Inactive" && (
                                                                <DropdownMenuItem className="text-green-600">
                                                                    Activate
                                                                    user
                                                                </DropdownMenuItem>
                                                            )}
                                                            <DropdownMenuItem
                                                                className="text-red-600"
                                                                onClick={() =>
                                                                    openBanDialog(
                                                                        user.id,
                                                                        user.name
                                                                    )
                                                                }
                                                            >
                                                                Ban user
                                                            </DropdownMenuItem>
                                                        </>
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

            <BanConfirmationDialog
                open={banDialogOpen}
                onOpenChange={setBanDialogOpen}
                onConfirm={handleBanUser}
                title="Ban User"
                description="Review the complaints below before deciding to ban {entityName}. This action will prevent them from accessing the platform."
                entityName={selectedUser?.name || ""}
                complaints={
                    selectedUser
                        ? userComplaints[String(selectedUser.id)] || []
                        : []
                }
            />
        </div>
    );
};

export default Users;
