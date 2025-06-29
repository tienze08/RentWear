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
import ApiConstants from "@/lib/api";
import { User } from "@/lib/types";
import axiosInstance from "@/lib/axiosInstance";

// ----------------------
// Types
// ----------------------

type Complaint = {
    id: string;
    reporter: string;
    reason: string;
    description: string;
    date: string;
    severity: "Low" | "Medium" | "High";
};

type UserItem = {
    _id: string;
    name: string; // sẽ gán từ username
    email: string;
    role: string;
    status: string;
    createdAt: string;
};

type ReportPayload = {
    _id: string;
    reporter?: {
        username: string;
    };
    reason: string;
    description: string;
    createdAt: string;
};

// ----------------------
// Component
// ----------------------

const Users = () => {
    const [users, setUsers] = useState<UserItem[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [banDialogOpen, setBanDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<{
        id: string;
        name: string;
    } | null>(null);
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const { toast } = useToast();
    const banEntity = (id: string, reason: string) =>
        axiosInstance.patch(ApiConstants.BAN_USER(id), { reason });

    const unbanEntity = (id: string) =>
        axiosInstance.patch(ApiConstants.UNBAN_USER(id));

    const handleBanUser = async (reason: string) => {
        if (!selectedUser) return;
        const { id } = selectedUser;

        setBanDialogOpen(false); // đóng dialog trước
        setSelectedUser(null);

        try {
            await banEntity(id, reason);
            setUsers((prev) =>
                prev.map((u) =>
                    u._id === id ? { ...u, status: "BLOCKED" } : u
                )
            );
            toast({ title: "User blocked", description: reason });
        } catch (err) {
            toast({
                title: "Ban failed",
                description: String(err),
                variant: "destructive",
            });
        }
    };

    const handleUnbanUser = async (id: string, name: string) => {
        try {
            await unbanEntity(id); // ⬅️ gọi API
            setUsers((prev) =>
                prev.map((u) => (u._id === id ? { ...u, status: "ACTIVE" } : u))
            );
            toast({
                title: "User unbanned",
                description: `${name} reactivated`,
            });
        } catch (err) {
            toast({
                title: "Unban failed",
                description: String(err),
                variant: "destructive",
            });
        }
    };

    const fetchUsers = async () => {
        try {
            const data: User[] = await getAllUsers();
            const mapped: UserItem[] = data.map((user) => ({
                _id: user._id,
                name: user.username,
                email: user.email,
                role: user.role,
                status: user.status,
                createdAt: (user as any).createdAt || new Date().toISOString(),
            }));
            setUsers(mapped);
        } catch (error) {
            console.error("Failed to fetch users:", error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        if (!banDialogOpen || !selectedUser) return;

        (async () => {
            console.log("[fetchReports] for", selectedUser.id);
            try {
                const res = await fetch(
                    ApiConstants.GET_REPORTS_BY_TARGET(selectedUser.id),
                    {
                        credentials: "include",
                        headers: { "Content-Type": "application/json" },
                    }
                );
                if (!res.ok) throw new Error(res.statusText);
                const data: ReportPayload[] = await res.json();
                console.log("[fetchReports] data →", data);

                setComplaints(
                    data.map((r) => ({
                        id: r._id,
                        reporter: r.reporter?.username || "Unknown",
                        reason: r.reason,
                        description: r.description,
                        date: new Date(r.createdAt).toISOString().slice(0, 10),
                        severity: "Medium",
                    }))
                );
            } catch (err) {
                toast({
                    title: "Không lấy được report",
                    description: String(err),
                    variant: "destructive",
                });
                setComplaints([]);
            }
        })();
    }, [banDialogOpen, selectedUser, toast]);

    const openBanDialog = (id: string, name: string) => {
        console.log("[openBanDialog] id=", id);
        setSelectedUser({ id, name });
        setBanDialogOpen(true);
    };

    const filteredUsers = users.filter(
        (user) =>
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.role.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // --------------------
    // Helpers
    // --------------------

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "active":
                return "border-green-500 text-green-600 bg-green-50";
            case "inactive":
                return "border-yellow-500 text-yellow-600 bg-yellow-50";
            case "banned":
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
                    <UserPlus className="h-4 w-4 mr-2" /> Add User
                </Button>
            </div>

            <Card className="border-b border-sidebar-border">
                <div className="p-6">
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                        <div className="relative w-full sm:max-w-xs">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
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
                            <Filter className="h-4 w-4 mr-2" /> Filter
                        </Button>
                    </div>

                    {/* Table Body */}
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
                                        {/* Name */}
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

                                        {/* Email */}
                                        <TableCell>{user.email}</TableCell>

                                        {/* Role */}
                                        <TableCell>
                                            <span
                                                className={`text-xs px-2 py-1 rounded ${getRoleBadge(
                                                    user.role
                                                )}`}
                                            >
                                                {user.role}
                                            </span>
                                        </TableCell>

                                        {/* Status */}
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

                                        {/* Join Date */}
                                        <TableCell>
                                            {new Date(
                                                user.createdAt
                                            ).toLocaleDateString()}
                                        </TableCell>

                                        {/* Actions */}
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
                                                    "BLOCKED" ? (
                                                        <DropdownMenuItem
                                                            className="text-green-600"
                                                            onClick={() =>
                                                                handleUnbanUser(
                                                                    user._id,
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
                                                                        user._id,
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

            {/* Ban Dialog */}
            <BanConfirmationDialog
                open={banDialogOpen}
                onOpenChange={setBanDialogOpen}
                onConfirm={handleBanUser}
                title="Ban User"
                description="Review the complaints below before deciding to ban {entityName}."
                entityName={selectedUser?.name || ""}
                complaints={complaints}
            />
        </div>
    );
};

export default Users;
