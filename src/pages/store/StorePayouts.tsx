import { useState, useEffect } from "react";
import { Card } from "../../components/ui/card";
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
  DollarSign,
  Clock,
  CheckCircle,
  TrendingUp,
  Calendar,
  CreditCard,
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

const StorePayouts = () => {
  const [payouts, setPayouts] = useState<StorePayout[]>([]);
  const [summary, setSummary] = useState<PayoutSummary>({
    totalEarnings: 0,
    pendingEarnings: 0,
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPayouts = async () => {
      try {
        const response = await axiosInstance.get(ApiConstants.GET_STORE_PAYOUTS);
        setPayouts(response.data.payouts);
        setSummary(response.data.summary);
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

    fetchPayouts();
  }, [toast]);

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
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
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
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          My Earnings & Payouts
        </h1>
        <p className="text-gray-500 mt-1">
          Track your store earnings and payout history
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Earnings</p>
              <h3 className="text-2xl font-bold">
                {summary.totalEarnings.toLocaleString()} VNĐ
              </h3>
              <p className="text-xs text-green-600 mt-1">
                ✓ Successfully received
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Earnings</p>
              <h3 className="text-2xl font-bold">
                {summary.pendingEarnings.toLocaleString()} VNĐ
              </h3>
              <p className="text-xs text-yellow-600 mt-1">⏳ Being processed</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Payouts</p>
              <h3 className="text-2xl font-bold">{payouts.length}</h3>
              <p className="text-xs text-blue-600 mt-1">📊 All time</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Payout History */}
      <Card>
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Payout History</h2>
          {payouts.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Commission</TableHead>
                    <TableHead>Net Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payout Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payouts.map((payout) => (
                    <TableRow key={payout._id}>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                          {new Date(payout.createdAt).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {payout.amount.toLocaleString()} VNĐ
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{payout.commission}%</Badge>
                      </TableCell>
                      <TableCell className="font-semibold text-green-600">
                        {payout.netAmount.toLocaleString()} VNĐ
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {getPayoutMethodIcon(payout.payoutMethod)}
                          <span className="ml-2 text-sm">
                            {payout.payoutMethod.replace("_", " ")}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(payout.status)}>
                          {getStatusIcon(payout.status)}
                          <span className="ml-1">{payout.status}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {payout.payoutDate ? (
                          <div className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                            {new Date(payout.payoutDate).toLocaleDateString()}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <DollarSign className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No payouts yet
              </h3>
              <p className="text-gray-500">
                Your payouts will appear here once the admin processes your
                earnings.
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Payout Information */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Payout Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">
              Commission Structure
            </h4>
            <p className="text-sm text-gray-600 mb-2">
              The platform charges a commission on each successful rental:
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Standard commission: 10% of rental amount</li>
              <li>• You receive: 90% of rental amount</li>
              <li>• Commission helps maintain the platform</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Payout Schedule</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Payouts are processed manually by admin</li>
              <li>• Typical processing time: 3-5 business days</li>
              <li>• You'll be notified when payout is processed</li>
              <li>• Minimum payout amount: 100,000 VNĐ</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StorePayouts;
