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
import BanConfirmationDialog from "@/components/admin/BanConfirmationDialog";
import { useToast } from "@/hooks/use-toast";

type Complaint = {
    id: string;
    reporter: string;
    reason: string;
    description: string;
    date: string;
    severity: "Low" | "Medium" | "High";
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

const RentalShop = () => {
    const [stores, setStores] = useState<User[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [banDialogOpen, setBanDialogOpen] = useState(false);
    const [shopComplaints, setShopComplaints] = useState<
        Record<string, Complaint[]>
    >({});
    const [selectedShop, setSelectedShop] = useState<{
        id: string;
        name: string;
    } | null>(null);
    const { toast } = useToast();

    const banEntity = (id: string, reason: string) =>
        axiosInstance.patch(ApiConstants.BAN_USER(id), { reason });

    const unbanEntity = (id: string) =>
        axiosInstance.patch(ApiConstants.UNBAN_USER(id));

    const handleBanShop = async (reason: string) => {
        if (!selectedShop) return;
        const { id } = selectedShop;

        setBanDialogOpen(false); // đóng dialog trước
        setSelectedShop(null);

        try {
            await banEntity(id, reason);
            setStores((prev) =>
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

    const handleUnbanShop = async (id: string, name: string) => {
        try {
            await unbanEntity(id);
            setStores((prev) =>
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

    const openBanDialog = (shopId: string, shopName: string) => {
        setSelectedShop({ id: shopId, name: shopName });
        setBanDialogOpen(true);
    };

    /* ---------------------------- data ---------------------------- */
    useEffect(() => {
        (async () => {
            try {
                const { data } = await axiosInstance.get(ApiConstants.STORES);
                setStores(data);
            } catch (err) {
                console.error("Error fetching stores:", err);
            }
        })();
    }, []);

    useEffect(() => {
        if (!banDialogOpen || !selectedShop) return;

        (async () => {
            console.log("[fetchReports] for", selectedShop.id);
            try {
                const res = await fetch(
                    ApiConstants.GET_REPORTS_BY_TARGET(selectedShop.id),
                    {
                        credentials: "include",
                        headers: { "Content-Type": "application/json" },
                    }
                );
                if (!res.ok) throw new Error(res.statusText);
                const data: ReportPayload[] = await res.json();
                console.log("[fetchReports] data →", data);

                const complaints = data.map((r) => ({
                    id: r._id,
                    reporter: r.reporter?.username || "Unknown",
                    reason: r.reason,
                    description: r.description,
                    date: new Date(r.createdAt).toISOString().slice(0, 10),
                    severity: "Medium" as const,
                }));

                setShopComplaints((prev) => ({
                    ...prev,
                    [selectedShop.id]: complaints,
                }));
            } catch (err) {
                toast({
                    title: "Không lấy được report",
                    description: String(err),
                    variant: "destructive",
                });
                setShopComplaints((prev) => ({
                    ...prev,
                    [selectedShop.id]: [],
                }));
            }
        })();
    }, [banDialogOpen, selectedShop, toast]);

    const filteredStores = stores.filter((s) =>
        (s.storeInfo?.storeName ?? "")
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
    );

    const statusColor = (status: User["status"]) => {
        switch (status) {
            case "ACTIVE":
                return "border-green-500 text-green-600 bg-green-50";
            case "INACTIVE":
                return "border-red-500 text-red-600 bg-red-50";
            case "BLOCKED":
                return "border-red-500 text-red-600 bg-red-50";
            default:
                return "border-gray-500 text-gray-600 bg-gray-50";
        }
    };

    /* --------------------------- render --------------------------- */
    return (
        <div className="space-y-6">
            {/* header */}
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
                    <Plus className="h-4 w-4 mr-2" /> Add Shop
                </Button>
            </div>

            <Card className="border-b border-sidebar-border">
                <div className="p-6">
                    {/* search + filter */}
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                        <div className="relative w-full sm:max-w-xs">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
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
                            <Filter className="h-4 w-4 mr-2" /> Filter
                        </Button>
                    </div>

                    {/* table */}
                    <div className="mt-6 overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-b border-sidebar-border">
                                    <TableHead>Shop Name</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Owner</TableHead>
                                    <TableHead>Phone</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredStores.map((shop) => (
                                    <TableRow
                                        key={shop._id}
                                        className="border-b border-sidebar-border"
                                    >
                                        <TableCell>
                                            <div className="flex items-center">
                                                <div className="h-8 w-8 rounded bg-blue-100 flex items-center justify-center mr-3">
                                                    <StoreIcon className="h-4 w-4 text-blue-600" />
                                                </div>
                                                <span className="font-medium">
                                                    {shop.storeInfo
                                                        ?.storeName ?? "—"}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center">
                                                <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                                                {shop.address ?? "—"}
                                            </div>
                                        </TableCell>
                                        <TableCell>{shop.username}</TableCell>
                                        <TableCell>
                                            {shop.phone ?? "—"}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={statusColor(
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
                                                <DropdownMenuContent
                                                    align="end"
                                                    className="bg-white hover:cursor-pointer shadow-lg rounded-md"
                                                >
                                                    <DropdownMenuLabel>
                                                        Actions
                                                    </DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    {shop.status ===
                                                    "BLOCKED" ? (
                                                        <DropdownMenuItem
                                                            className="text-green-600"
                                                            onClick={() =>
                                                                handleUnbanShop(
                                                                    shop._id,
                                                                    shop
                                                                        .storeInfo
                                                                        ?.storeName ??
                                                                        shop.username
                                                                )
                                                            }
                                                        >
                                                            Unban shop
                                                        </DropdownMenuItem>
                                                    ) : (
                                                        <>
                                                            {shop.status ===
                                                                "ACTIVE" && (
                                                                <DropdownMenuItem className="text-yellow-600">
                                                                    Deactivate
                                                                    shop
                                                                </DropdownMenuItem>
                                                            )}
                                                            {shop.status ===
                                                                "INACTIVE" && (
                                                                <DropdownMenuItem className="text-green-600">
                                                                    Activate
                                                                    shop
                                                                </DropdownMenuItem>
                                                            )}
                                                            <DropdownMenuItem
                                                                className="text-red-600"
                                                                onClick={() =>
                                                                    openBanDialog(
                                                                        shop._id,
                                                                        shop
                                                                            .storeInfo
                                                                            ?.storeName ??
                                                                            shop.username
                                                                    )
                                                                }
                                                            >
                                                                Ban shop
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

                        {filteredStores.length === 0 && (
                            <div className="text-center py-10">
                                <p className="text-gray-500">No shops found</p>
                            </div>
                        )}
                    </div>
                </div>
            </Card>

            {/* ban dialog */}
            <BanConfirmationDialog
                open={banDialogOpen}
                onOpenChange={setBanDialogOpen}
                onConfirm={handleBanShop}
                title="Ban Shop"
                description={`Review the complaints below before deciding to ban ${selectedShop?.name}. This action will prevent them from operating on the platform.`}
                entityName={selectedShop?.name || ""}
                complaints={
                    selectedShop ? shopComplaints[selectedShop.id] ?? [] : []
                }
            />
        </div>
    );
};

export default RentalShop;
