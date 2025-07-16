import { useEffect, useState } from "react";
import {
  Users,
  Package,
  Store,
  DollarSign,
  ShoppingCart,
  AlertTriangle,
  MessageSquare,
  TrendingUp,
} from "lucide-react";
import DashboardCard from "@/components/admin/DashboardCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axiosInstance from "@/lib/axiosInstance";
import ApiConstants from "@/lib/api";
import LoadingSpinner from "@/components/ui/loading-spinner";

// Types for API responses
interface DashboardOverview {
  totalUsers: number;
  totalCustomers: number;
  totalStores: number;
  totalProducts: number;
  totalRentals: number;
  totalActiveRentals: number;
  totalCompletedRentals: number;
  totalRevenue: number;
  totalReports: number;
  totalFeedbacks: number;
}

interface MonthlyRevenue {
  year: number;
  month: number;
  monthName: string;
  revenue: number;
  count: number;
}

interface RecentActivity {
  id: string;
  customer: string;
  product: string;
  status: string;
  amount: number;
  date: string;
}

const Dashboard = () => {
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [monthlyRevenue, setMonthlyRevenue] = useState<MonthlyRevenue[]>([]);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [overviewRes, monthlyRevenueRes] = await Promise.all([
          axiosInstance.get(ApiConstants.DASHBOARD_OVERVIEW),
          axiosInstance.get(ApiConstants.DASHBOARD_MONTHLY_REVENUE),
        ]);

        setOverview(overviewRes.data.overview);
        setRecentActivities(overviewRes.data.recentActivities);
        setMonthlyRevenue(monthlyRevenueRes.data);
      } catch (err: unknown) {
        console.error("Error fetching dashboard data:", err);
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load dashboard data";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Error Loading Dashboard
          </h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!overview) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            No Data Available
          </h2>
          <p className="text-gray-600">
            Dashboard data is not available at the moment.
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Welcome back to your admin dashboard
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Total Users"
          value={overview?.totalUsers?.toString() || "0"}
          description="Active accounts"
          icon={Users}
          trend={12}
        />
        <DashboardCard
          title="Total Products"
          value={overview?.totalProducts?.toString() || "0"}
          description="In inventory"
          icon={Package}
          trend={-2}
        />
        <DashboardCard
          title="Partner Stores"
          value={overview?.totalStores?.toString() || "0"}
          description="Active stores"
          icon={Store}
          trend={8}
        />
        <DashboardCard
          title="Total Revenue"
          value={`${
            overview?.totalRevenue?.toLocaleString("vi-VN") || "0"
          } VND`}
          description="All time"
          icon={DollarSign}
          trend={15}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-white border-sidebar-border">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">
              Revenue Overview (Last 12 Months)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyRevenue || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="monthName" />
                  <YAxis
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                  />
                  <Tooltip
                    formatter={(value: number) => [
                      `${value.toLocaleString("vi-VN")} VND`,
                      "Revenue",
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="p-6 bg-white border-sidebar-border">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">
              Rental Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-blue-800">
                    Total Rentals
                  </span>
                </div>
                <span className="text-blue-600 font-bold">
                  {overview?.totalRentals || 0}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-800">
                    Active Rentals
                  </span>
                </div>
                <span className="text-green-600 font-bold">
                  {overview?.totalActiveRentals || 0}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-purple-600" />
                  <span className="font-medium text-purple-800">Completed</span>
                </div>
                <span className="text-purple-600 font-bold">
                  {overview?.totalCompletedRentals || 0}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  <span className="font-medium text-orange-800">Reports</span>
                </div>
                <span className="text-orange-600 font-bold">
                  {overview?.totalReports || 0}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card className="p-6 bg-white border-sidebar-border">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">
            Recent Activities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities && recentActivities.length > 0 ? (
              recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <ShoppingCart className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">
                        {activity.customer} rented {activity.product}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(activity.date).toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">
                      {activity.amount.toLocaleString("vi-VN")} VND
                    </p>
                    <p className="text-sm text-gray-500 capitalize">
                      {activity.status}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p>No recent activities</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
