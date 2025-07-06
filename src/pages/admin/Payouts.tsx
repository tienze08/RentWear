import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  Eye,
  Search,
  Filter,
} from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";
import ApiConstants from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface Payout {
  _id: string;
  storeId: {
    _id: string;
    username: string;
    email: string;
    storeInfo?: {
      storeName: string;
    };
  };
  amount: number;
  commission: number;
  netAmount: number;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  payoutMethod: "BANK_TRANSFER" | "PAYPAL" | "WALLET";
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
  paypalEmail?: string;
  createdAt: string;
  payoutDate?: string;
  notes?: string;
}

interface PendingPayout {
  storeId: string;
  payments: string[];
  totalAmount: number;
  commission: number;
  netAmount: number;
}

const AdminPayouts = () => {
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [pendingPayouts, setPendingPayouts] = useState<PendingPayout[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedPayout, setSelectedPayout] = useState<Payout | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const { toast } = useToast();

  // Form state for creating payout
  const [createForm, setCreateForm] = useState({
    storeId: "",
    paymentIds: [] as string[],
    payoutMethod: "BANK_TRANSFER",
    commission: 10,
    bankDetails: {
      bankName: "",
      accountNumber: "",
      accountName: "",
    },
    paypalEmail: "",
    notes: "",
  });

  useEffect(() => {
    fetchPayouts();
    fetchPendingPayouts();
  }, []);

  const fetchPayouts = async () => {
    try {
      const response = await axiosInstance.get(ApiConstants.GET_ALL_PAYOUTS);
      setPayouts(response.data.payouts);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch payouts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingPayouts = async () => {
    try {
      const response = await axiosInstance.get(
        ApiConstants.GET_PENDING_PAYOUTS
      );
      setPendingPayouts(response.data.pendingPayouts);
    } catch (error) {
      console.error("Failed to fetch pending payouts:", error);
    }
  };

  const handleCreatePayout = async () => {
    try {
      await axiosInstance.post(ApiConstants.CREATE_PAYOUT, createForm);
      toast({
        title: "Success",
        description: "Payout created successfully",
      });
      setShowCreateDialog(false);
      fetchPayouts();
      fetchPendingPayouts();
      // Reset form
      setCreateForm({
        storeId: "",
        paymentIds: [],
        payoutMethod: "BANK_TRANSFER",
        commission: 10,
        bankDetails: { bankName: "", accountNumber: "", accountName: "" },
        paypalEmail: "",
        notes: "",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create payout",
        variant: "destructive",
      });
    }
  };

  const handleUpdateStatus = async (payoutId: string, status: string) => {
    try {
      await axiosInstance.put(ApiConstants.UPDATE_PAYOUT_STATUS(payoutId), {
        status,
      });
      toast({
        title: "Success",
        description: "Payout status updated successfully",
      });
      fetchPayouts();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update payout status",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "PROCESSING":
        return "bg-blue-100 text-blue-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "FAILED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Clock className="h-4 w-4" />;
      case "PROCESSING":
        return <Clock className="h-4 w-4" />;
      case "COMPLETED":
        return <CheckCircle className="h-4 w-4" />;
      case "FAILED":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const filteredPayouts = payouts.filter((payout) => {
    const matchesSearch = payout.storeId.username
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "" || payout.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Store Payouts</h1>
          <p className="text-gray-500 mt-1">
            Manage store earnings and payouts
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Payout
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Payouts</p>
              <h3 className="text-2xl font-bold">
                {payouts.filter((p) => p.status === "COMPLETED").length}
              </h3>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <h3 className="text-2xl font-bold">
                {payouts.filter((p) => p.status === "PENDING").length}
              </h3>
            </div>
            <Clock className="h-8 w-8 text-yellow-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Amount</p>
              <h3 className="text-2xl font-bold">
                {payouts
                  .filter((p) => p.status === "COMPLETED")
                  .reduce((sum, p) => sum + p.amount, 0)
                  .toLocaleString()}{" "}
                VNĐ
              </h3>
            </div>
            <DollarSign className="h-8 w-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Available to Payout</p>
              <h3 className="text-2xl font-bold">
                {pendingPayouts
                  .reduce((sum, p) => sum + p.netAmount, 0)
                  .toLocaleString()}{" "}
                VNĐ
              </h3>
            </div>
            <DollarSign className="h-8 w-8 text-green-500" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by store name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Status</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="PROCESSING">Processing</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="FAILED">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Payouts Table */}
      <Card>
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">All Payouts</h2>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Store</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Commission</TableHead>
                  <TableHead>Net Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayouts.map((payout) => (
                  <TableRow key={payout._id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {payout.storeId.storeInfo?.storeName ||
                            payout.storeId.username}
                        </div>
                        <div className="text-sm text-gray-500">
                          {payout.storeId.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{payout.amount.toLocaleString()} VNĐ</TableCell>
                    <TableCell>{payout.commission}%</TableCell>
                    <TableCell>
                      {payout.netAmount.toLocaleString()} VNĐ
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{payout.payoutMethod}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(payout.status)}>
                        {getStatusIcon(payout.status)}
                        <span className="ml-1">{payout.status}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(payout.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedPayout(payout);
                            setShowDetailsDialog(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {payout.status === "PENDING" && (
                          <>
                            <Button
                              size="sm"
                              onClick={() =>
                                handleUpdateStatus(payout._id, "PROCESSING")
                              }
                            >
                              Process
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleUpdateStatus(payout._id, "FAILED")
                              }
                            >
                              Reject
                            </Button>
                          </>
                        )}
                        {payout.status === "PROCESSING" && (
                          <Button
                            size="sm"
                            onClick={() =>
                              handleUpdateStatus(payout._id, "COMPLETED")
                            }
                          >
                            Complete
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </Card>

      {/* Create Payout Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Store Payout</DialogTitle>
            <DialogDescription>
              Create a new payout for a store based on their earnings
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="storeId">Store ID</Label>
              <Input
                id="storeId"
                value={createForm.storeId}
                onChange={(e) =>
                  setCreateForm({ ...createForm, storeId: e.target.value })
                }
                placeholder="Enter store ID"
              />
            </div>

            <div>
              <Label htmlFor="paymentIds">Payment IDs (comma separated)</Label>
              <Textarea
                id="paymentIds"
                value={createForm.paymentIds.join(", ")}
                onChange={(e) =>
                  setCreateForm({
                    ...createForm,
                    paymentIds: e.target.value
                      .split(",")
                      .map((id) => id.trim()),
                  })
                }
                placeholder="Enter payment IDs separated by commas"
              />
            </div>

            <div>
              <Label htmlFor="commission">Commission (%)</Label>
              <Input
                id="commission"
                type="number"
                value={createForm.commission}
                onChange={(e) =>
                  setCreateForm({
                    ...createForm,
                    commission: Number(e.target.value),
                  })
                }
              />
            </div>

            <div>
              <Label htmlFor="payoutMethod">Payout Method</Label>
              <Select
                value={createForm.payoutMethod}
                onValueChange={(value) =>
                  setCreateForm({
                    ...createForm,
                    payoutMethod: value as any,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                  <SelectItem value="PAYPAL">PayPal</SelectItem>
                  <SelectItem value="WALLET">Wallet</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {createForm.payoutMethod === "BANK_TRANSFER" && (
              <div className="space-y-2">
                <Label>Bank Details</Label>
                <Input
                  placeholder="Bank Name"
                  value={createForm.bankDetails.bankName}
                  onChange={(e) =>
                    setCreateForm({
                      ...createForm,
                      bankDetails: {
                        ...createForm.bankDetails,
                        bankName: e.target.value,
                      },
                    })
                  }
                />
                <Input
                  placeholder="Account Number"
                  value={createForm.bankDetails.accountNumber}
                  onChange={(e) =>
                    setCreateForm({
                      ...createForm,
                      bankDetails: {
                        ...createForm.bankDetails,
                        accountNumber: e.target.value,
                      },
                    })
                  }
                />
                <Input
                  placeholder="Account Name"
                  value={createForm.bankDetails.accountName}
                  onChange={(e) =>
                    setCreateForm({
                      ...createForm,
                      bankDetails: {
                        ...createForm.bankDetails,
                        accountName: e.target.value,
                      },
                    })
                  }
                />
              </div>
            )}

            {createForm.payoutMethod === "PAYPAL" && (
              <div>
                <Label htmlFor="paypalEmail">PayPal Email</Label>
                <Input
                  id="paypalEmail"
                  type="email"
                  value={createForm.paypalEmail}
                  onChange={(e) =>
                    setCreateForm({
                      ...createForm,
                      paypalEmail: e.target.value,
                    })
                  }
                  placeholder="Enter PayPal email"
                />
              </div>
            )}

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={createForm.notes}
                onChange={(e) =>
                  setCreateForm({ ...createForm, notes: e.target.value })
                }
                placeholder="Additional notes"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCreateDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreatePayout}>Create Payout</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payout Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Payout Details</DialogTitle>
          </DialogHeader>
          {selectedPayout && (
            <div className="space-y-4">
              <div>
                <Label>Store</Label>
                <p className="text-sm">
                  {selectedPayout.storeId.storeInfo?.storeName ||
                    selectedPayout.storeId.username}
                </p>
              </div>
              <div>
                <Label>Amount</Label>
                <p className="text-sm">
                  {selectedPayout.amount.toLocaleString()} VNĐ
                </p>
              </div>
              <div>
                <Label>Net Amount</Label>
                <p className="text-sm">
                  {selectedPayout.netAmount.toLocaleString()} VNĐ
                </p>
              </div>
              <div>
                <Label>Status</Label>
                <Badge className={getStatusColor(selectedPayout.status)}>
                  {selectedPayout.status}
                </Badge>
              </div>
              {selectedPayout.bankDetails && (
                <div>
                  <Label>Bank Details</Label>
                  <div className="text-sm space-y-1">
                    <p>Bank: {selectedPayout.bankDetails.bankName}</p>
                    <p>Account: {selectedPayout.bankDetails.accountNumber}</p>
                    <p>Name: {selectedPayout.bankDetails.accountName}</p>
                  </div>
                </div>
              )}
              {selectedPayout.notes && (
                <div>
                  <Label>Notes</Label>
                  <p className="text-sm">{selectedPayout.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPayouts;
