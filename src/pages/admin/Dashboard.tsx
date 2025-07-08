import { Users, Package, Store, TrendingUp } from "lucide-react";
import DashboardCard from "@/components/admin/DashboardCard";
import { Card } from "@/components/ui/card";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart as ReBarChart,
    Bar,
} from "recharts";

const revenueData = [
    { name: "Jan", value: 4000 },
    { name: "Feb", value: 3000 },
    { name: "Mar", value: 5000 },
    { name: "Apr", value: 4500 },
    { name: "May", value: 6000 },
    { name: "Jun", value: 5200 },
    { name: "Jul", value: 7000 },
];

const productsData = [
    { name: "Category A", value: 400 },
    { name: "Category B", value: 300 },
    { name: "Category C", value: 200 },
    { name: "Category D", value: 350 },
    { name: "Category E", value: 280 },
];

const Dashboard = () => {
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
                    value="225"
                    description="Active accounts"
                    icon={Users}
                    trend={12}
                />
                <DashboardCard
                    title="Total Products"
                    value="100"
                    description="In inventory"
                    icon={Package}
                    trend={-2}
                />
                <DashboardCard
                    title="Partner Shops"
                    value="5"
                    description="Across 12 cities"
                    icon={Store}
                    trend={8}
                />
                <DashboardCard
                    title="Monthly Revenue"
                    value="541203 đồng"
                    description="For current month"
                    icon={TrendingUp}
                    trend={15}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6 bg-white border-sidebar-border">
                    <h2 className="text-lg font-semibold mb-4 text-gray-800">
                        Revenue Overview
                    </h2>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData}>
                                <defs>
                                    <linearGradient
                                        id="colorValue"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >
                                        <stop
                                            offset="5%"
                                            stopColor="#3b82f6"
                                            stopOpacity={0.8}
                                        />
                                        <stop
                                            offset="95%"
                                            stopColor="#3b82f6"
                                            stopOpacity={0}
                                        />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#3b82f6"
                                    fillOpacity={1}
                                    fill="url(#colorValue)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card className="border-sidebar-border p-6 bg-white">
                    <h2 className="text-lg font-semibold mb-4 text-gray-800">
                        Product Categories
                    </h2>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <ReBarChart data={productsData}>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    horizontal={true}
                                    vertical={false}
                                />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar
                                    dataKey="value"
                                    fill="#3b82f6"
                                    radius={[4, 4, 0, 0]}
                                />
                            </ReBarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="p-6 bg-white col-span-2 border-sidebar-border">
                    <h2 className="text-lg font-semibold mb-4 text-gray-800">
                        Recent Activities
                    </h2>
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((item) => (
                            <div
                                key={item}
                                className="flex items-center justify-between pb-4 border-b border-gray-100"
                            >
                                <div className="flex items-center">
                                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center mr-4">
                                        <Users className="h-5 w-5 text-gray-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">
                                            New user registered
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            2 hours ago
                                        </p>
                                    </div>
                                </div>
                                <span className="text-xs bg-blue-50 text-blue-700 py-1 px-2 rounded">
                                    User
                                </span>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card className="p-6 bg-white border-sidebar-border">
                    <h2 className="text-lg font-semibold mb-4 text-gray-800">
                        Quick Stats
                    </h2>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">
                                New Orders
                            </span>
                            <span className="text-sm font-semibold">45</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                            <div
                                className="bg-green-500 h-2 rounded-full"
                                style={{ width: "45%" }}
                            ></div>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">
                                Pending Returns
                            </span>
                            <span className="text-sm font-semibold">12</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                            <div
                                className="bg-yellow-500 h-2 rounded-full"
                                style={{ width: "15%" }}
                            ></div>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">
                                Support Tickets
                            </span>
                            <span className="text-sm font-semibold">18</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                            <div
                                className="bg-blue-500 h-2 rounded-full"
                                style={{ width: "25%" }}
                            ></div>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">
                                Customer Satisfaction
                            </span>
                            <span className="text-sm font-semibold">92%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                            <div
                                className="bg-purple-500 h-2 rounded-full"
                                style={{ width: "92%" }}
                            ></div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
