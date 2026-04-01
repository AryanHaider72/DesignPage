"use client";

import { useEffect, useState } from "react";
import {
  ShoppingCart,
  Users,
  Package,
  DollarSign,
  X,
  Store,
  TrendingUp,
  Calendar,
  CreditCard,
} from "lucide-react";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import GetInitalStoreSalesMan from "@/api/lib/Admin/Stores/GetInitalStore/GetInitalStore";
import { StoreApiResponse, storeInital } from "@/api/types/Admin/Store/Store";
import { useRouter } from "next/navigation";
import DashboardOverviewStatsAdmin from "@/api/lib/Admin/DashboardOverview/DashboardOverview";

// Define types based on API response
interface StoreData {
  storeID: string;
  storeName: string;
  totalItemsSold: number;
}

interface RatingData {
  storeID: string;
  storeName: string;
  storeRating: number;
}

interface SaleData {
  saleDate: string;
  dailyRevenue: number;
  status: string;
}

interface DashboardApiResponse {
  message: string;
  stores: StoreData[];
  stats: { successfullOrders: number }[];
  rating: RatingData[];
  onlineSale: SaleData[];
  offlineSale: SaleData[];
}

// Colors for pie chart
const COLORS = [
  "#111827",
  "#374151",
  "#4B5563",
  "#6B7280",
  "#9CA3AF",
  "#D1D5DB",
];

/* ---------- COMPONENT ---------- */

export default function AdminDashboard() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [storeList, setStoreList] = useState<storeInital[]>([]);
  const [dashboardData, setDashboardData] =
    useState<DashboardApiResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // Calculate total revenue from sales
  const totalRevenue = () => {
    let revenue = 0;
    if (dashboardData?.onlineSale && dashboardData.onlineSale.length > 0) {
      revenue += dashboardData.onlineSale.reduce(
        (sum, sale) => sum + sale.dailyRevenue,
        0,
      );
    }
    if (dashboardData?.offlineSale && dashboardData.offlineSale.length > 0) {
      revenue += dashboardData.offlineSale.reduce(
        (sum, sale) => sum + sale.dailyRevenue,
        0,
      );
    }
    return revenue;
  };

  // Calculate total orders (successful orders from stats)
  const totalOrders = () => {
    if (dashboardData?.stats && dashboardData.stats.length > 0) {
      return dashboardData.stats[0].successfullOrders;
    }
    return 0;
  };

  // Calculate total items sold across all stores
  const totalItemsSold = () => {
    if (dashboardData?.stores && dashboardData.stores.length > 0) {
      return dashboardData.stores.reduce(
        (sum, store) => sum + store.totalItemsSold,
        0,
      );
    }
    return 0;
  };

  // Prepare pie chart data for store items sold
  const getPieChartData = () => {
    if (!dashboardData?.stores || dashboardData.stores.length === 0) return [];
    return dashboardData.stores.map((store) => ({
      name:
        store.storeName.length > 15
          ? store.storeName.slice(0, 12) + "..."
          : store.storeName,
      fullName: store.storeName,
      value: store.totalItemsSold,
      storeID: store.storeID,
    }));
  };

  // Prepare revenue chart data (combine online and offline sales by date)
  const getRevenueChartData = () => {
    const salesMap = new Map<
      string,
      { date: string; revenue: number; online: number; offline: number }
    >();

    if (dashboardData?.onlineSale && dashboardData.onlineSale.length > 0) {
      dashboardData.onlineSale.forEach((sale) => {
        const date = new Date(sale.saleDate).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
        if (!salesMap.has(date)) {
          salesMap.set(date, { date, revenue: 0, online: 0, offline: 0 });
        }
        const entry = salesMap.get(date)!;
        entry.revenue += sale.dailyRevenue;
        entry.online += sale.dailyRevenue;
      });
    }

    if (dashboardData?.offlineSale && dashboardData.offlineSale.length > 0) {
      dashboardData.offlineSale.forEach((sale) => {
        const date = new Date(sale.saleDate).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
        if (!salesMap.has(date)) {
          salesMap.set(date, { date, revenue: 0, online: 0, offline: 0 });
        }
        const entry = salesMap.get(date)!;
        entry.revenue += sale.dailyRevenue;
        entry.offline += sale.dailyRevenue;
      });
    }

    return Array.from(salesMap.values()).sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
  };

  // Prepare rating data for stores
  const getRatingData = () => {
    if (!dashboardData?.rating || dashboardData.rating.length === 0) return [];
    return dashboardData.rating
      .filter(
        (r) =>
          r.storeRating > 0 ||
          (dashboardData?.stores &&
            dashboardData.stores.some((s) => s.storeID === r.storeID)),
      )
      .map((r) => ({
        name:
          r.storeName.length > 12
            ? r.storeName.slice(0, 10) + "..."
            : r.storeName,
        fullName: r.storeName,
        rating: r.storeRating,
        storeID: r.storeID,
      }));
  };

  // Fetch stores and dashboard data
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await GetInitalStoreSalesMan(String(token));
      if (response.status === 200 || response.status === 201) {
        const data = response.data as StoreApiResponse;
        console.log("Store List:", data);
        setStoreList(data.storeList);
      } else if (response.status === 401) {
        router.push("/admin/login");
      }
    } catch (error) {
      console.error("Error fetching stores:", error);
    }
  };

  // Fetch dashboard specific data (you'll need to implement this API call)
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const response = await DashboardOverviewStatsAdmin(String(token));
      const data = response.data as DashboardApiResponse;
      setDashboardData(data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchDashboardData();
  }, []);

  useEffect(() => setMounted(true), []);

  // Custom tooltip for pie chart
  const CustomPieTooltip = ({ active, payload }: any) => {
    if (
      active &&
      payload &&
      payload.length &&
      payload[0] &&
      payload[0].payload
    ) {
      return (
        <div className="bg-white/95 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-neutral-200">
          <p className="font-semibold text-neutral-800">
            {payload[0].payload.fullName || payload[0].name}
          </p>
          <p className="text-sm text-neutral-600">
            Items Sold:{" "}
            <span className="font-bold text-neutral-900">
              {payload[0].value}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom label for pie chart
  const renderCustomLabel = ({
    name,
    percent,
  }: {
    name?: string;
    percent?: number;
  }) => {
    if (percent && percent > 0.05 && name) {
      return `${name}: ${(percent * 100).toFixed(0)}%`;
    }
    return "";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-neutral-200 border-t-neutral-800 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const pieData = getPieChartData();
  const revenueChartData = getRevenueChartData();
  const ratingData = getRatingData();
  const hasSalesData = revenueChartData.length > 0;

  return (
    <div className="min-h-screen  p-4 md:p-8 space-y-8 overflow-y-auto">
      {/* Header */}
      <div
        className={`flex flex-col md:flex-row items-start md:items-center justify-between transition-all duration-700
        ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-neutral-800 to-neutral-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Store performance & analytics overview
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-2 text-sm text-neutral-500">
          <Calendar className="h-4 w-4" />
          <span>Last updated: {new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {/* KPIs - Dynamic based on API data */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.06)] transform transition-all duration-300 hover:scale-105 hover:shadow-lg border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-neutral-500 font-medium">
                Total Revenue
              </p>
              <h2 className="text-2xl font-bold mt-1 text-neutral-800">
                PKR {totalRevenue().toLocaleString()}
              </h2>
            </div>
            <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.06)] transform transition-all duration-300 hover:scale-105 hover:shadow-lg border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-neutral-500 font-medium">
                Total Orders
              </p>
              <h2 className="text-2xl font-bold mt-1 text-neutral-800">
                {totalOrders().toLocaleString()}
              </h2>
            </div>
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <ShoppingCart className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.06)] transform transition-all duration-300 hover:scale-105 hover:shadow-lg border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-neutral-500 font-medium">
                Items Sold
              </p>
              <h2 className="text-2xl font-bold mt-1 text-neutral-800">
                {totalItemsSold().toLocaleString()}
              </h2>
            </div>
            <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
              <Package className="h-5 w-5 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.06)] transform transition-all duration-300 hover:scale-105 hover:shadow-lg border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-neutral-500 font-medium">
                Active Stores
              </p>
              <h2 className="text-2xl font-bold mt-1 text-neutral-800">
                {dashboardData?.stores?.length || 0}
              </h2>
            </div>
            <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
              <Store className="h-5 w-5 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* CHARTS SECTION - Revenue & Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Chart - Bar Chart */}
        <div className="rounded-3xl bg-white/80 backdrop-blur-xl p-6 shadow-[0_20px_40px_rgba(0,0,0,0.07)] border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-neutral-800">
              Daily Revenue
            </h3>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-neutral-800"></span>{" "}
                Online
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-neutral-400"></span>{" "}
                Offline
              </span>
            </div>
          </div>

          {mounted && hasSalesData ? (
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueChartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    opacity={0.15}
                    stroke="#9CA3AF"
                  />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `PKR ${value / 1000}k`}
                  />
                  <Tooltip
                    formatter={(value: number | undefined) => {
                      if (value === undefined) return ["PKR 0", "Revenue"];
                      return [`PKR ${value.toLocaleString()}`, "Revenue"];
                    }}
                    contentStyle={{
                      backgroundColor: "white",
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="online"
                    fill="#111827"
                    radius={[6, 6, 0, 0]}
                    name="Online Sales"
                  />
                  <Bar
                    dataKey="offline"
                    fill="#6B7280"
                    radius={[6, 6, 0, 0]}
                    name="Offline Sales"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[320px] flex items-center justify-center text-neutral-400">
              No revenue data available
            </div>
          )}
        </div>

        {/* Pie Chart - Store Items Sold Distribution */}
        <div className="rounded-3xl bg-white/80 backdrop-blur-xl p-6 shadow-[0_20px_40px_rgba(0,0,0,0.07)] border border-white/20">
          <h3 className="text-lg font-semibold text-neutral-800 mb-2">
            Items Sold by Store
          </h3>
          <p className="text-xs text-neutral-500 mb-6">
            Distribution of total items sold across stores
          </p>

          {mounted && pieData.length > 0 && pieData.some((d) => d.value > 0) ? (
            <>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                      label={renderCustomLabel}
                      labelLine={false}
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap justify-center gap-3 mt-4 pt-2 border-t border-neutral-100">
                {pieData.map((entry, index) => (
                  <div key={entry.storeID} className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <span className="text-xs text-neutral-600">
                      {entry.fullName}
                    </span>
                    <span className="text-xs font-semibold text-neutral-800">
                      {entry.value} items
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-[320px] flex flex-col items-center justify-center text-neutral-400">
              <Package className="h-12 w-12 mb-3 opacity-50" />
              <p>No sales data available</p>
              <p className="text-xs mt-1">
                Items sold will appear here once stores make sales
              </p>
            </div>
          )}
        </div>
      </div>

      {/* SECOND ROW - Store Ratings & Sales Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Store Ratings */}
        <div className="lg:col-span-2 rounded-3xl bg-white/80 backdrop-blur-xl p-6 shadow-[0_20px_40px_rgba(0,0,0,0.07)] border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-neutral-800">
              Store Ratings
            </h3>
            <TrendingUp className="h-4 w-4 text-neutral-400" />
          </div>

          {ratingData.length > 0 ? (
            <div className="space-y-4">
              {ratingData.map((store) => (
                <div
                  key={store.storeID}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-neutral-50/80 transition"
                >
                  <div>
                    <p className="font-medium text-neutral-800">
                      {store.fullName}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className={`h-3.5 w-3.5 ${star <= Math.round(store.rating) ? "text-yellow-400" : "text-neutral-300"}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="text-xs text-neutral-500 ml-2">
                        ({store.rating.toFixed(1)})
                      </span>
                    </div>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      store.rating >= 4
                        ? "bg-green-100 text-green-700"
                        : store.rating >= 3
                          ? "bg-yellow-100 text-yellow-700"
                          : store.rating > 0
                            ? "bg-orange-100 text-orange-700"
                            : "bg-neutral-100 text-neutral-500"
                    }`}
                  >
                    {store.rating >= 4
                      ? "Excellent"
                      : store.rating >= 3
                        ? "Good"
                        : store.rating > 0
                          ? "Average"
                          : "Not Rated"}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-neutral-400 py-8">
              No rating data available
            </div>
          )}
        </div>

        {/* Sales Status Summary */}
        <div className="rounded-3xl bg-white/80 backdrop-blur-xl p-6 shadow-[0_20px_40px_rgba(0,0,0,0.07)] border border-white/20">
          <h3 className="text-lg font-semibold text-neutral-800 mb-6">
            Recent Sales Status
          </h3>

          {(dashboardData?.onlineSale && dashboardData.onlineSale.length > 0) ||
          (dashboardData?.offlineSale &&
            dashboardData.offlineSale.length > 0) ? (
            <div className="space-y-4">
              {/* Online Sales Summary */}
              {dashboardData?.onlineSale &&
                dashboardData.onlineSale.length > 0 && (
                  <div className="p-4 rounded-xl bg-neutral-50/80">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-neutral-700">
                          Online Sales
                        </span>
                      </div>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          dashboardData.onlineSale[0].status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : dashboardData.onlineSale[0].status === "completed"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {dashboardData.onlineSale[0].status}
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-neutral-800">
                      PKR{" "}
                      {dashboardData.onlineSale[0].dailyRevenue.toLocaleString()}
                    </p>
                    <p className="text-xs text-neutral-500 mt-1">
                      {new Date(
                        dashboardData.onlineSale[0].saleDate,
                      ).toLocaleDateString()}
                    </p>
                  </div>
                )}

              {/* Offline Sales Summary */}
              {dashboardData?.offlineSale &&
                dashboardData.offlineSale.length > 0 && (
                  <div className="p-4 rounded-xl bg-neutral-50/80">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Store className="h-4 w-4 text-emerald-600" />
                        <span className="text-sm font-medium text-neutral-700">
                          Offline Sales
                        </span>
                      </div>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          dashboardData.offlineSale[0].status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : dashboardData.offlineSale[0].status ===
                                "completed"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {dashboardData.offlineSale[0].status}
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-neutral-800">
                      PKR{" "}
                      {dashboardData.offlineSale[0].dailyRevenue.toLocaleString()}
                    </p>
                    <p className="text-xs text-neutral-500 mt-1">
                      {new Date(
                        dashboardData.offlineSale[0].saleDate,
                      ).toLocaleDateString()}
                    </p>
                  </div>
                )}

              {/* Total combined */}
              <div className="pt-3 mt-2 border-t border-neutral-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-neutral-600">
                    Total Today
                  </span>
                  <span className="text-xl font-bold text-neutral-800">
                    PKR{" "}
                    {(
                      (dashboardData?.onlineSale?.[0]?.dailyRevenue || 0) +
                      (dashboardData?.offlineSale?.[0]?.dailyRevenue || 0)
                    ).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-neutral-400 py-8">
              <CreditCard className="h-10 w-10 mx-auto mb-3 opacity-50" />
              <p>No sales data available</p>
            </div>
          )}
        </div>
      </div>

      {/* Store List Section */}
      {dashboardData?.stores && dashboardData.stores.length > 0 && (
        <div className="rounded-3xl bg-white/80 backdrop-blur-xl p-6 shadow-[0_20px_40px_rgba(0,0,0,0.07)] border border-white/20">
          <h3 className="text-lg font-semibold text-neutral-800 mb-4">
            Store Performance
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="text-left py-3 px-4 font-medium text-neutral-500">
                    Store Name
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-neutral-500">
                    Items Sold
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-neutral-500">
                    Rating
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-neutral-500">
                    Performance
                  </th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.stores.map((store) => {
                  const storeRating =
                    dashboardData.rating?.find(
                      (r) => r.storeID === store.storeID,
                    )?.storeRating || 0;
                  const totalSold = totalItemsSold();
                  return (
                    <tr
                      key={store.storeID}
                      className="border-b border-neutral-100 hover:bg-neutral-50/50 transition"
                    >
                      <td className="py-3 px-4 font-medium text-neutral-800">
                        {store.storeName}
                      </td>
                      <td className="py-3 px-4 text-neutral-600">
                        {store.totalItemsSold} items
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <span className="text-neutral-600">
                            {storeRating.toFixed(1)}
                          </span>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <svg
                                key={star}
                                className={`h-3 w-3 ${star <= Math.round(storeRating) ? "text-yellow-400" : "text-neutral-300"}`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="w-24 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-neutral-700 rounded-full"
                            style={{
                              width: `${totalSold > 0 ? (store.totalItemsSold / totalSold) * 100 : 0}%`,
                            }}
                          ></div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
