import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    LineChart,
    Line,
    BarChart,
    Bar,
    Legend,
} from "recharts";
import { ArrowUp, DollarSign, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";

const monthlyData = [
    { name: "Jan", revenue: 4000, expenses: 2400, profit: 1600 },
    { name: "Feb", revenue: 3000, expenses: 1398, profit: 1602 },
    { name: "Mar", revenue: 5000, expenses: 2800, profit: 2200 },
    { name: "Apr", revenue: 4500, expenses: 2000, profit: 2500 },
    { name: "May", revenue: 6000, expenses: 3000, profit: 3000 },
    { name: "Jun", revenue: 5200, expenses: 2800, profit: 2400 },
    { name: "Jul", revenue: 7000, expenses: 3500, profit: 3500 },
    { name: "Aug", revenue: 6500, expenses: 3200, profit: 3300 },
    { name: "Sep", revenue: 8000, expenses: 4000, profit: 4000 },
    { name: "Oct", revenue: 7500, expenses: 3800, profit: 3700 },
    { name: "Nov", revenue: 9000, expenses: 4500, profit: 4500 },
    { name: "Dec", revenue: 9800, expenses: 5000, profit: 4800 },
];

const weeklyData = [
    { name: "Mon", revenue: 1200, expenses: 700, profit: 500 },
    { name: "Tue", revenue: 1500, expenses: 800, profit: 700 },
    { name: "Wed", revenue: 1300, expenses: 750, profit: 550 },
    { name: "Thu", revenue: 1700, expenses: 900, profit: 800 },
    { name: "Fri", revenue: 2000, expenses: 1100, profit: 900 },
    { name: "Sat", revenue: 2400, expenses: 1300, profit: 1100 },
    { name: "Sun", revenue: 1800, expenses: 950, profit: 850 },
];

const categoryData = [
    { name: "Biking", value: 45 },
    { name: "Hiking", value: 28 },
    { name: "Camping", value: 35 },
    { name: "Winter", value: 25 },
    { name: "Water", value: 18 },
    { name: "Climbing", value: 12 },
];

const Revenue = () => {
    const [summary, setSummary] = useState<{
        totalRevenue: number;
        totalExpenses: number;
        totalProfit: number;
        profitMargin: number;
    } | null>(null);

    useEffect(() => {
        const fetchSummary = async () => {
            const res = await axiosInstance.get("/payments/summary");
            const data = res.data;

            setSummary(data);
        };
        fetchSummary();
    }, []);

    console.log("Revenue summary:", summary);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Revenue</h1>
                <p className="text-gray-500 mt-1">
                    Analytics and financial overview
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="p-6 border-sidebar-border">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm text-gray-500 font-medium">
                                Total Revenue
                            </p>
                            <h3 className="text-2xl font-bold mt-1">
                                {summary?.totalRevenue} đồng
                            </h3>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                            <DollarSign className="h-5 w-5 text-green-600" />
                        </div>
                    </div>
                    <div className="flex items-center mt-4">
                        <ArrowUp className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium text-green-500 ml-1">
                            12.5%
                        </span>
                        <span className="text-xs text-gray-500 ml-2">
                            vs last month
                        </span>
                    </div>
                </Card>

                <Card className="p-6 border-sidebar-border">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm text-gray-500 font-medium">
                                Total Expenses
                            </p>
                            <h3 className="text-2xl font-bold mt-1">
                                {summary?.totalExpenses} đồng
                            </h3>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                            <DollarSign className="h-5 w-5 text-red-600" />
                        </div>
                    </div>
                    <div className="flex items-center mt-4">
                        <ArrowUp className="h-4 w-4 text-red-500" />
                        <span className="text-sm font-medium text-red-500 ml-1">
                            8.2%
                        </span>
                        <span className="text-xs text-gray-500 ml-2">
                            vs last month
                        </span>
                    </div>
                </Card>

                <Card className="p-6 border-sidebar-border">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm text-gray-500 font-medium">
                                Total Profit
                            </p>
                            <h3 className="text-2xl font-bold mt-1">
                                {summary?.totalProfit} đồng
                            </h3>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <TrendingUp className="h-5 w-5 text-blue-600" />
                        </div>
                    </div>
                    <div className="flex items-center mt-4">
                        <ArrowUp className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium text-green-500 ml-1">
                            18.3%
                        </span>
                        <span className="text-xs text-gray-500 ml-2">
                            vs last month
                        </span>
                    </div>
                </Card>

                <Card className="p-6 border-sidebar-border">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm text-gray-500 font-medium">
                                Profit Margin
                            </p>
                            <h3 className="text-2xl font-bold mt-1">
                                {summary?.profitMargin.toFixed(2)}%
                            </h3>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                            <TrendingUp className="h-5 w-5 text-purple-600" />
                        </div>
                    </div>
                    <div className="flex items-center mt-4">
                        <ArrowUp className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium text-green-500 ml-1">
                            5.2%
                        </span>
                        <span className="text-xs text-gray-500 ml-2">
                            vs last month
                        </span>
                    </div>
                </Card>
            </div>

            <Tabs defaultValue="monthly" className="space-y-6">
                <div className="flex justify-between items-center">
                    <TabsList>
                        <TabsTrigger value="weekly">Weekly</TabsTrigger>
                        <TabsTrigger value="monthly">Monthly</TabsTrigger>
                        <TabsTrigger value="yearly">Yearly</TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="weekly" className="space-y-6">
                    <Card className="p-6 border-sidebar-border">
                        <h3 className="text-lg font-semibold mb-4">
                            Weekly Revenue Overview
                        </h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={weeklyData}>
                                    <defs>
                                        <linearGradient
                                            id="colorRevenue"
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
                                        <linearGradient
                                            id="colorExpenses"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >
                                            <stop
                                                offset="5%"
                                                stopColor="#ef4444"
                                                stopOpacity={0.8}
                                            />
                                            <stop
                                                offset="95%"
                                                stopColor="#ef4444"
                                                stopOpacity={0}
                                            />
                                        </linearGradient>
                                        <linearGradient
                                            id="colorProfit"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >
                                            <stop
                                                offset="5%"
                                                stopColor="#22c55e"
                                                stopOpacity={0.8}
                                            />
                                            <stop
                                                offset="95%"
                                                stopColor="#22c55e"
                                                stopOpacity={0}
                                            />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        vertical={false}
                                    />
                                    <Tooltip />
                                    <Legend />
                                    <Area
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="#3b82f6"
                                        fillOpacity={1}
                                        fill="url(#colorRevenue)"
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="expenses"
                                        stroke="#ef4444"
                                        fillOpacity={1}
                                        fill="url(#colorExpenses)"
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="profit"
                                        stroke="#22c55e"
                                        fillOpacity={1}
                                        fill="url(#colorProfit)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </TabsContent>

                <TabsContent value="monthly" className="space-y-6">
                    <Card className="p-6 border-sidebar-border">
                        <h3 className="text-lg font-semibold mb-4">
                            Monthly Revenue Overview
                        </h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={monthlyData}>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        vertical={false}
                                    />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="#3b82f6"
                                        strokeWidth={2}
                                        dot={{ r: 4 }}
                                        activeDot={{ r: 6 }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="expenses"
                                        stroke="#ef4444"
                                        strokeWidth={2}
                                        dot={{ r: 4 }}
                                        activeDot={{ r: 6 }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="profit"
                                        stroke="#22c55e"
                                        strokeWidth={2}
                                        dot={{ r: 4 }}
                                        activeDot={{ r: 6 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </TabsContent>

                <TabsContent value="yearly" className="space-y-6">
                    <Card className="p-6 border-sidebar-border">
                        <h3 className="text-lg font-semibold mb-4">
                            Yearly Comparison
                        </h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={monthlyData}>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        vertical={false}
                                    />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar
                                        dataKey="revenue"
                                        fill="#3b82f6"
                                        name="Revenue"
                                    />
                                    <Bar
                                        dataKey="expenses"
                                        fill="#ef4444"
                                        name="Expenses"
                                    />
                                    <Bar
                                        dataKey="profit"
                                        fill="#22c55e"
                                        name="Profit"
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </TabsContent>
            </Tabs>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6 border-sidebar-border">
                    <h3 className="text-lg font-semibold mb-4">
                        Revenue by Category
                    </h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={categoryData} layout="vertical">
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    horizontal={true}
                                    vertical={false}
                                />
                                <XAxis type="number" />
                                <YAxis dataKey="name" type="category" />
                                <Tooltip />
                                <Bar
                                    dataKey="value"
                                    fill="#3b82f6"
                                    radius={[0, 4, 4, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card className="p-6 border-sidebar-border">
                    <h3 className="text-lg font-semibold mb-4">
                        Top Performing Products
                    </h3>
                    <div className="space-y-4">
                        {[
                            {
                                name: "Premium Mountain Bike",
                                sales: 245,
                                revenue: "$29,400",
                                percentage: 85,
                            },
                            {
                                name: "Camping Tent (4-person)",
                                sales: 189,
                                revenue: "$8,505",
                                percentage: 70,
                            },
                            {
                                name: "Snowboard (Advanced)",
                                sales: 156,
                                revenue: "$14,820",
                                percentage: 65,
                            },
                            {
                                name: "Kayak",
                                sales: 132,
                                revenue: "$9,900",
                                percentage: 55,
                            },
                            {
                                name: "Backpack 65L",
                                sales: 124,
                                revenue: "$3,100",
                                percentage: 45,
                            },
                        ].map((item, index) => (
                            <div key={index} className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">
                                        {item.name}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        {item.revenue}
                                    </span>
                                </div>
                                <div className="w-full h-2 bg-gray-100 rounded-full">
                                    <div
                                        className="h-2 bg-blue-500 rounded-full"
                                        style={{ width: `${item.percentage}%` }}
                                    ></div>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <span>{item.sales} sales</span>
                                    <span>{item.percentage}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Revenue;
