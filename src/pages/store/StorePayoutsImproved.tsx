import { useState, useEffect, useCallback } from "react";
import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
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
  TrendingUp,
  Calendar,
  CreditCard,
  XCircle,
  AlertCircle,
  Download,
  Filter,
} from "lucide-react";
import axiosInstance from "../../lib/axiosInstance";
import ApiConstants from "../../lib/api";
import { useToast } from "../../hooks/use-toast";

interface StorePayout {
  _id: string;
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

interface PayoutSummary {
  totalEarnings: number;
  pendingEarnings: number;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const StorePayouts = () => {
  const [payouts, setPayouts] = useState<StorePayout[]>([]);
  const [summary, setSummary] = useState<PayoutSummary>({
    totalEarnings: 0,
    pendingEarnings: 0,
  });
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const { toast } = useToast();

  const fetchPayouts = useCallback(
    async (page = 1, status = "") => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          page: page.toString(),
          limit: pagination.limit.toString(),
          ...(status && { status }),
        });

        const response = await axiosInstance.get(
          `${ApiConstants.GET_STORE_PAYOUTS}?${params}`
        );

        setPayouts(response.data.payouts);
        setSummary(response.data.summary);
        setPagination(response.data.pagination);
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
    },
    [pagination.limit, toast]
  );

  useEffect(() => {
    fetchPayouts(1, statusFilter);
  }, [fetchPayouts, statusFilter]);

  const handlePageChange = (newPage: number) => {
    fetchPayouts(newPage, statusFilter);
  };

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    setPagination((prev) => ({ ...prev, page: 1 }));
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

  const getPayoutMethodIcon = (method: string) => {
    switch (method) {
      case "BANK_TRANSFER":
        return <CreditCard className="h-4 w-4" />;
      case "PAYPAL":
        return <DollarSign className="h-4 w-4" />;
      case "WALLET":
        return <DollarSign className="h-4 w-4" />;
      default:
        return <CreditCard className="h-4 w-4" />;
    }
  };

  const exportPayouts = () => {
    try {
      const csvContent = [
        [
          "Date",
          "Amount",
          "Commission",
          "Net Amount",
          "Status",
          "Method",
          "Payout Date",
        ],
        ...payouts.map((payout) => [
          new Date(payout.createdAt).toLocaleDateString(),
          payout.amount.toString(),
          `${payout.commission}%`,
          payout.netAmount.toString(),
          payout.status,
          payout.payoutMethod.replace("_", " "),
          payout.payoutDate
            ? new Date(payout.payoutDate).toLocaleDateString()
            : "N/A",
        ]),
      ]
        .map((row) => row.join(","))
        .join("\\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `store-payouts-${
        new Date().toISOString().split("T")[0]
      }.csv`;
      a.click();
      window.URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "Payouts exported successfully",
      });
    } catch (error) {
      console.error("Export failed:", error);
      toast({
        title: "Error",
        description: "Failed to export payouts",
        variant: "destructive",
      });
    }
  };

  if (loading && pagination.page === 1) {
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
          <h1 className="text-3xl font-bold">Thu nhập của tôi</h1>
          <p className="text-gray-600">
            Xem lịch sử thanh toán và thu nhập từ platform
          </p>
        </div>
        {payouts.length > 0 && (
          <Button onClick={exportPayouts} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tổng thu nhập</p>
              <p className="text-2xl font-bold text-green-600">
                ${summary.totalEarnings.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">Đã nhận được</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Đang chờ</p>
              <p className="text-2xl font-bold text-yellow-600">
                ${summary.pendingEarnings.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">Chờ xử lý</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Số lần thanh toán
              </p>
              <p className="text-2xl font-bold text-blue-600">
                {pagination.total}
              </p>
              <p className="text-xs text-gray-500">Tổng cộng</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex justify-between items-center">
        <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
          <SelectTrigger className="w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Lọc theo trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Tất cả trạng thái</SelectItem>
            <SelectItem value="PENDING">Đang chờ</SelectItem>
            <SelectItem value="PROCESSING">Đang xử lý</SelectItem>
            <SelectItem value="COMPLETED">Hoàn thành</SelectItem>
            <SelectItem value="FAILED">Thất bại</SelectItem>
          </SelectContent>
        </Select>

        <div className="text-sm text-gray-600">
          Hiển thị {(pagination.page - 1) * pagination.limit + 1} -{" "}
          {Math.min(pagination.page * pagination.limit, pagination.total)} của{" "}
          {pagination.total} kết quả
        </div>
      </div>

      {/* Payouts Table */}
      <Card>
        {payouts.length === 0 ? (
          <div className="p-8 text-center">
            <DollarSign className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Chưa có thanh toán nào
            </h3>
            <p className="text-gray-600">
              Các khoản thanh toán sẽ xuất hiện ở đây khi có đơn hàng được hoàn
              thành.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ngày tạo</TableHead>
                <TableHead>Tổng tiền</TableHead>
                <TableHead>Hoa hồng</TableHead>
                <TableHead>Thực nhận</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Phương thức</TableHead>
                <TableHead>Ngày thanh toán</TableHead>
                <TableHead>Ghi chú</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payouts.map((payout) => (
                <TableRow key={payout._id}>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      {new Date(payout.createdAt).toLocaleDateString("vi-VN")}
                    </div>
                  </TableCell>

                  <TableCell className="font-medium">
                    ${payout.amount.toLocaleString()}
                  </TableCell>

                  <TableCell className="text-red-600">
                    -{payout.commission}%
                  </TableCell>

                  <TableCell className="font-bold text-green-600">
                    ${payout.netAmount.toLocaleString()}
                  </TableCell>

                  <TableCell>
                    <Badge
                      className={`${getStatusColor(
                        payout.status
                      )} flex items-center w-fit`}
                    >
                      {getStatusIcon(payout.status)}
                      <span className="ml-1">
                        {payout.status === "PENDING" && "Đang chờ"}
                        {payout.status === "PROCESSING" && "Đang xử lý"}
                        {payout.status === "COMPLETED" && "Hoàn thành"}
                        {payout.status === "FAILED" && "Thất bại"}
                      </span>
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center">
                      {getPayoutMethodIcon(payout.payoutMethod)}
                      <span className="ml-2">
                        {payout.payoutMethod === "BANK_TRANSFER" &&
                          "Chuyển khoản"}
                        {payout.payoutMethod === "PAYPAL" && "PayPal"}
                        {payout.payoutMethod === "WALLET" && "Ví điện tử"}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    {payout.payoutDate ? (
                      <div className="flex items-center text-green-600">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        {new Date(payout.payoutDate).toLocaleDateString(
                          "vi-VN"
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400">Chưa thanh toán</span>
                    )}
                  </TableCell>

                  <TableCell>
                    {payout.notes ? (
                      <span className="text-sm text-gray-600">
                        {payout.notes}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1 || loading}
          >
            Trước
          </Button>

          <div className="flex space-x-1">
            {Array.from(
              { length: Math.min(5, pagination.totalPages) },
              (_, i) => {
                const pageNum = i + 1;
                return (
                  <Button
                    key={pageNum}
                    variant={
                      pagination.page === pageNum ? "default" : "outline"
                    }
                    onClick={() => handlePageChange(pageNum)}
                    disabled={loading}
                    size="sm"
                  >
                    {pageNum}
                  </Button>
                );
              }
            )}
          </div>

          <Button
            variant="outline"
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages || loading}
          >
            Sau
          </Button>
        </div>
      )}

      {/* Payment Method Details */}
      {payouts.length > 0 && (
        <Card className="p-4">
          <h3 className="font-semibold mb-3">
            Thông tin phương thức thanh toán
          </h3>

          {/* Show bank details if any */}
          {payouts.some((p) => p.bankDetails) && (
            <div className="mb-3">
              <h4 className="text-sm font-medium text-gray-700 mb-1">
                Chuyển khoản ngân hàng:
              </h4>
              {payouts
                .filter((p) => p.bankDetails)
                .slice(0, 1)
                .map((payout) => (
                  <div key={payout._id} className="text-sm text-gray-600">
                    <p>Ngân hàng: {payout.bankDetails?.bankName}</p>
                    <p>Số tài khoản: {payout.bankDetails?.accountNumber}</p>
                    <p>Tên tài khoản: {payout.bankDetails?.accountName}</p>
                  </div>
                ))}
            </div>
          )}

          {/* Show PayPal email if any */}
          {payouts.some((p) => p.paypalEmail) && (
            <div className="mb-3">
              <h4 className="text-sm font-medium text-gray-700 mb-1">
                PayPal:
              </h4>
              {payouts
                .filter((p) => p.paypalEmail)
                .slice(0, 1)
                .map((payout) => (
                  <p key={payout._id} className="text-sm text-gray-600">
                    Email: {payout.paypalEmail}
                  </p>
                ))}
            </div>
          )}

          <p className="text-xs text-gray-500 mt-3">
            * Thông tin thanh toán được quản lý bởi admin. Liên hệ hỗ trợ nếu có
            thay đổi.
          </p>
        </Card>
      )}
    </div>
  );
};

export default StorePayouts;
