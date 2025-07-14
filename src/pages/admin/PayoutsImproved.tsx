import { useState, useEffect, useCallback } from "react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  Eye,
  Search,
  Filter,
  AlertCircle,
} from "lucide-react";
import axiosInstance from "../../lib/axiosInstance";
import ApiConstants from "../../lib/api";
import { useToast } from "../../hooks/use-toast";

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
  storeInfo?: {
    username: string;
    email: string;
    storeInfo?: {
      storeName: string;
    };
  };
  payments: string[];
  totalAmount: number;
  commission: number;
  netAmount: number;
  rentalsCount: number;
}

interface Statistics {
  totalStats: Array<{
    _id: string;
    count: number;
    totalAmount: number;
    totalNetAmount: number;
  }>;
  monthlyStats: Array<{
    _id: { year: number; month: number };
    count: number;
    totalAmount: number;
    totalNetAmount: number;
  }>;
}

const AdminPayouts = () => {
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [pendingPayouts, setPendingPayouts] = useState<PendingPayout[]>([]);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
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
    payoutMethod: "BANK_TRANSFER" as "BANK_TRANSFER" | "PAYPAL" | "WALLET",
    commission: 10,
    bankDetails: {
      bankName: "",
      accountNumber: "",
      accountName: "",
    },
    paypalEmail: "",
    notes: "",
  });

  const fetchPayouts = useCallback(async () => {
    try {
      const response = await axiosInstance.get(ApiConstants.GET_ALL_PAYOUTS);
      setPayouts(response.data.payouts);
    } catch (error) {
      console.error("Failed to fetch payouts:", error);
      toast({
        title: "Error",
        description: "Failed to fetch payouts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const fetchPendingPayouts = useCallback(async () => {
    try {
      const response = await axiosInstance.get(
        ApiConstants.GET_PENDING_PAYOUTS
      );
      setPendingPayouts(response.data.pendingPayouts);
    } catch (error) {
      console.error("Failed to fetch pending payouts:", error);
    }
  }, []);

  const fetchStatistics = useCallback(async () => {
    try {
      const response = await axiosInstance.get(
        ApiConstants.GET_PAYOUT_STATISTICS
      );
      setStatistics(response.data);
    } catch (error) {
      console.error("Failed to fetch statistics:", error);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        fetchPayouts(),
        fetchPendingPayouts(),
        fetchStatistics(),
      ]);
    };

    loadData();
  }, [fetchPayouts, fetchPendingPayouts, fetchStatistics]);

  const handleCreatePayout = async () => {
    try {
      await axiosInstance.post(ApiConstants.CREATE_PAYOUT, createForm);
      toast({
        title: "Success",
        description: "Payout created successfully",
      });
      setShowCreateDialog(false);
      await Promise.all([fetchPayouts(), fetchPendingPayouts()]);
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
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error && "response" in error
          ? (error as any).response?.data?.message || "Failed to create payout"
          : "Failed to create payout";
      toast({
        title: "Error",
        description: errorMessage,
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
      await fetchPayouts();
    } catch (error) {
      console.error("Failed to update payout status:", error);
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
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const filteredPayouts = payouts.filter((payout) => {
    const matchesSearch =
      payout.storeId.username
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      payout.storeId.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (payout.storeId.storeInfo?.storeName || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "" || payout.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalStats = statistics?.totalStats.reduce(
    (acc, stat) => {
      acc.totalPayouts += stat.count;
      acc.totalAmount += stat.totalAmount;
      acc.totalNetAmount += stat.totalNetAmount;
      return acc;
    },
    { totalPayouts: 0, totalAmount: 0, totalNetAmount: 0 }
  ) || { totalPayouts: 0, totalAmount: 0, totalNetAmount: 0 };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Payout Management</h1>
          <p className="text-gray-600">Manage store payouts and earnings</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Payout
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Payouts</p>
              <p className="text-2xl font-bold">{totalStats.totalPayouts}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Amount</p>
              <p className="text-2xl font-bold">
                ${totalStats.totalAmount.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Net Amount</p>
              <p className="text-2xl font-bold">
                ${totalStats.totalNetAmount.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Pending Stores
              </p>
              <p className="text-2xl font-bold">{pendingPayouts.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Pending Payouts Alert */}
      {pendingPayouts.length > 0 && (
        <Card className="p-4 border-yellow-200 bg-yellow-50">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
            <div>
              <h3 className="font-semibold text-yellow-800">
                {pendingPayouts.length} stores have pending earnings
              </h3>
              <p className="text-sm text-yellow-700">
                Total pending: $
                {pendingPayouts
                  .reduce((sum, p) => sum + p.netAmount, 0)
                  .toLocaleString()}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by store name, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Statuses</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="PROCESSING">Processing</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="FAILED">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Payouts Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Store</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Commission</TableHead>
              <TableHead>Net Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Created</TableHead>
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
                    <div className="text-sm text-gray-600">
                      {payout.storeId.email}
                    </div>
                  </div>
                </TableCell>
                <TableCell>${payout.amount.toLocaleString()}</TableCell>
                <TableCell>{payout.commission}%</TableCell>
                <TableCell className="font-medium">
                  ${payout.netAmount.toLocaleString()}
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(payout.status)}>
                    <div className="flex items-center">
                      {getStatusIcon(payout.status)}
                      <span className="ml-1">{payout.status}</span>
                    </div>
                  </Badge>
                </TableCell>
                <TableCell>{payout.payoutMethod.replace("_", " ")}</TableCell>
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
                      <Select
                        onValueChange={(value) =>
                          handleUpdateStatus(payout._id, value)
                        }
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue placeholder="Update" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PROCESSING">Processing</SelectItem>
                          <SelectItem value="COMPLETED">Complete</SelectItem>
                          <SelectItem value="FAILED">Fail</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Create Payout Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Payout</DialogTitle>
            <DialogDescription>
              Create a payout for a store based on completed payments
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="storeId" className="text-right">
                Store ID
              </Label>
              <Input
                id="storeId"
                value={createForm.storeId}
                onChange={(e) =>
                  setCreateForm({ ...createForm, storeId: e.target.value })
                }
                className="col-span-3"
                placeholder="Enter store ID"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="paymentIds" className="text-right">
                Payment IDs
              </Label>
              <Input
                id="paymentIds"
                value={createForm.paymentIds.join(",")}
                onChange={(e) =>
                  setCreateForm({
                    ...createForm,
                    paymentIds: e.target.value
                      .split(",")
                      .map((id) => id.trim())
                      .filter((id) => id),
                  })
                }
                className="col-span-3"
                placeholder="Enter payment IDs (comma separated)"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="commission" className="text-right">
                Commission (%)
              </Label>
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
                className="col-span-3"
                min="0"
                max="100"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="payoutMethod" className="text-right">
                Payout Method
              </Label>
              <Select
                value={createForm.payoutMethod}
                onValueChange={(value: "BANK_TRANSFER" | "PAYPAL" | "WALLET") =>
                  setCreateForm({
                    ...createForm,
                    payoutMethod: value,
                  })
                }
              >
                <SelectTrigger className="col-span-3">
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
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="bankName" className="text-right">
                    Bank Name
                  </Label>
                  <Input
                    id="bankName"
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
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="accountNumber" className="text-right">
                    Account Number
                  </Label>
                  <Input
                    id="accountNumber"
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
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="accountName" className="text-right">
                    Account Name
                  </Label>
                  <Input
                    id="accountName"
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
                    className="col-span-3"
                  />
                </div>
              </>
            )}

            {createForm.payoutMethod === "PAYPAL" && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="paypalEmail" className="text-right">
                  PayPal Email
                </Label>
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
                  className="col-span-3"
                />
              </div>
            )}

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">
                Notes
              </Label>
              <Textarea
                id="notes"
                value={createForm.notes}
                onChange={(e) =>
                  setCreateForm({ ...createForm, notes: e.target.value })
                }
                className="col-span-3"
                placeholder="Optional notes..."
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
                <h4 className="font-semibold">Store Information</h4>
                <p>
                  Name:{" "}
                  {selectedPayout.storeId.storeInfo?.storeName ||
                    selectedPayout.storeId.username}
                </p>
                <p>Email: {selectedPayout.storeId.email}</p>
              </div>

              <div>
                <h4 className="font-semibold">Payment Details</h4>
                <p>Amount: ${selectedPayout.amount.toLocaleString()}</p>
                <p>Commission: {selectedPayout.commission}%</p>
                <p>Net Amount: ${selectedPayout.netAmount.toLocaleString()}</p>
              </div>

              <div>
                <h4 className="font-semibold">Status & Method</h4>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(selectedPayout.status)}>
                    {getStatusIcon(selectedPayout.status)}
                    <span className="ml-1">{selectedPayout.status}</span>
                  </Badge>
                  <span>
                    via {selectedPayout.payoutMethod.replace("_", " ")}
                  </span>
                </div>
              </div>

              {selectedPayout.bankDetails && (
                <div>
                  <h4 className="font-semibold">Bank Details</h4>
                  <p>Bank: {selectedPayout.bankDetails.bankName}</p>
                  <p>Account: {selectedPayout.bankDetails.accountNumber}</p>
                  <p>Name: {selectedPayout.bankDetails.accountName}</p>
                </div>
              )}

              {selectedPayout.paypalEmail && (
                <div>
                  <h4 className="font-semibold">PayPal Details</h4>
                  <p>Email: {selectedPayout.paypalEmail}</p>
                </div>
              )}

              {selectedPayout.notes && (
                <div>
                  <h4 className="font-semibold">Notes</h4>
                  <p>{selectedPayout.notes}</p>
                </div>
              )}

              <div>
                <h4 className="font-semibold">Dates</h4>
                <p>
                  Created: {new Date(selectedPayout.createdAt).toLocaleString()}
                </p>
                {selectedPayout.payoutDate && (
                  <p>
                    Paid: {new Date(selectedPayout.payoutDate).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setShowDetailsDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPayouts;
