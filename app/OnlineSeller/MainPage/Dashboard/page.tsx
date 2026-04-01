"use client";

import { useEffect, useState } from "react";
import {
  ShoppingCart,
  Users,
  Package,
  DollarSign,
  X,
  Clock,
  Coins,
} from "lucide-react";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import GetInitalStoreSalesMan from "@/api/lib/Admin/Stores/GetInitalStore/GetInitalStore";
import { StoreApiResponse, storeInital } from "@/api/types/Admin/Store/Store";
import { useRouter } from "next/navigation";
import OnlineDashboardOverviewStats from "@/api/lib/OnlineSeller/DashboardOverview/DashboardOverview";
import { MdShoppingCartCheckout } from "react-icons/md";

/* ---------- DATA ---------- */

interface responseStats {
  message: string;
  stats: stats[];
  bargraph: bargraph[];
  recentSales: RecentSales[];
}
interface stats {
  completedOrder: number;
  cancelledOrder: number;
  pendingOrder: number;
  totalOrder: number;
  shippingExpense: number;
  cashRecieved: number;
}
interface bargraph {
  year: number;
  month: number;
  cashReceived: number;
}
interface RecentSales {
  qty: number;
  salePrice: number;
  productName: string;
  status: string;
  varientValue: string;
}

/* ---------- COMPONENT ---------- */

export default function OfflineSellerDashboard() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [StateData, setStateData] = useState<stats>();
  const [storeList, setStoreList] = useState<storeInital[]>([]);
  const [FetchDataBar, setFetchDataBar] = useState<bargraph[]>([]);
  const [FetchDataRecent, setFetchDataRecent] = useState<RecentSales[]>([]);
  const [ShowStore, setShowStore] = useState(false);

  // Transform bargraph data to include month names and create revenue/profit data
  const getMonthName = (monthNumber: number) => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return months[monthNumber - 1] || `Month ${monthNumber}`;
  };

  // Transform the bargraph data for charts
  const chartData = FetchDataBar.map((item) => ({
    month: getMonthName(item.month),
    revenue: item.cashReceived,
    // For profit, you might want to calculate based on some logic
    // For now, using a percentage of revenue as example
    profit: Math.round(item.cashReceived * 0.3), // 30% profit margin example
  }));

  const storesget = async () => {
    const token = localStorage.getItem("adminToken");
    const response = await GetInitalStoreSalesMan(String(token));
    if (response.status === 200 || response.status === 201) {
      const data = response.data as StoreApiResponse;
      console.log(data);
      setStoreList(data.storeList);
    }
  };

  const getStatsForAll = async (From: string, To: string) => {
    try {
      const token = localStorage.getItem("OnlineSellerToken");
      const response = await OnlineDashboardOverviewStats(
        String(token),
        From,
        To,
      );
      const data = response.data as responseStats;
      setFetchDataBar(data.bargraph);
      setFetchDataRecent(data.recentSales);
      setStateData(data.stats[0]);
    } finally {
    }
  };

  const stats = [
    {
      title: "Cash Received",
      value: StateData?.cashRecieved,
      icon: DollarSign,
    },
    { title: "Total Order", value: StateData?.totalOrder, icon: ShoppingCart },
    {
      title: "Complete Order",
      value: StateData?.completedOrder,
      icon: MdShoppingCartCheckout,
    },
    { title: "Pending Order", value: StateData?.pendingOrder, icon: Clock },
    { title: "Cancelled Order", value: StateData?.cancelledOrder, icon: X },
    {
      title: "Shipping Expense",
      value: StateData?.shippingExpense,
      icon: Coins,
    },
  ];

  useEffect(() => {
    if (dateFrom && dateTo) {
      getStatsForAll(dateFrom, dateTo);
    }
  }, [dateFrom, dateTo]);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const today = new Date();
    const dateTo = today.toISOString().split("T")[0];

    const pastDate = new Date();
    pastDate.setDate(today.getDate() - 30);
    const dateFrom = pastDate.toISOString().split("T")[0];

    setDateTo(dateTo);
    setDateFrom(dateFrom);
  }, []);

  return (
    <div className="min-h-screen from-neutral-50 via-white to-neutral-100 p-8 space-y-12 overflow-y-hidden">
      {ShowStore && (
        <div className="fixed h-screen inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Your Stores
              </h2>
              <button
                onClick={() => setShowStore(false)}
                className="p-1 rounded-full hover:bg-gray-200 transition"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            {storeList.length > 0 && (
              <>
                <div className="flex flex-col sm:flex-row gap-6">
                  {/* Store Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 flex-1">
                    {storeList.map((item: any) => (
                      <div
                        key={item.storeID}
                        onClick={() => {
                          router.push(
                            `/admin/AdminPortal/${item.storeID}/Dashboard`,
                          );
                        }}
                        className="relative bg-gray-50 shadow-md border border-gray-200 p-5 rounded-2xl 
                             hover:shadow-lg hover:-translate-y-1 hover:bg-white transition-all 
                             cursor-pointer text-center flex flex-col justify-center items-center"
                      >
                        {/* Store Name */}
                        <h3 className="text-lg font-semibold text-gray-900 pointer-events-none">
                          {item.storeName}
                        </h3>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <div
        className={`flex items-center justify-between transition-all duration-700
        ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
      >
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Store performance overview
          </p>
        </div>
      </div>

      <div className="w-full flex gap-5">
        <div className="w-full">
          <label className="block text-gray-700 font-medium mb-1">
            Date From
          </label>
          <input
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            type="date"
            className="w-full p-3 border text-gray-800 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>
        {/* Current Date */}
        <div className="w-full">
          <label className="block text-gray-700 font-medium mb-1">
            Current Date
          </label>
          <input
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            type="date"
            className="w-full p-3 border text-gray-800 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item, i) => (
          <div
            key={i}
            className="bg-white/70 backdrop-blur-xl p-6 rounded-2xl
        shadow-[0_10px_30px_rgba(0,0,0,0.06)]
        transform transition-transform duration-300 ease-in-out
        hover:scale-105 hover:shadow-lg flex justify-between items-center"
          >
            <div>
              <p className="text-xs uppercase tracking-wide text-neutral-500">
                {item.title}
              </p>
              <h2 className="text-2xl font-semibold mt-1">
                {typeof item.value === "number"
                  ? `${item.value.toLocaleString()}`
                  : item.value}
              </h2>
            </div>
            <item.icon className="h-9 w-9 text-neutral-700" />
          </div>
        ))}
      </div>

      {/* ANALYTICS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Bar Chart */}
        <div
          className="rounded-3xl bg-white/70 backdrop-blur-xl p-7
shadow-[0_20px_40px_rgba(0,0,0,0.07)]"
        >
          <h3 className="text-lg font-semibold mb-4">Monthly Revenue</h3>

          {mounted && (
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="revenue"
                    fill="#111827"
                    radius={[10, 10, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Profit Line Chart */}
        <div
          className="rounded-3xl bg-white/70 backdrop-blur-xl p-7
          shadow-[0_20px_40px_rgba(0,0,0,0.07)]"
        >
          <h3 className="text-lg font-semibold mb-4">Profit Trend</h3>

          {mounted && (
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="profit"
                    stroke="#16a34a"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* ORDERS + STOCK */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Orders */}
        <div
          className="lg:col-span-2 rounded-3xl bg-white/70 backdrop-blur-xl p-7
          shadow-[0_20px_40px_rgba(0,0,0,0.07)]"
        >
          <h3 className="text-lg font-semibold mb-6">Recent Orders</h3>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Product Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Quantity
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Rate (PKR)
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {FetchDataRecent.map((order, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.productName} - {order.varientValue}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === "Complete"
                            ? "bg-green-100 text-green-800"
                            : order.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {order.qty}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      PKR {order.salePrice.toLocaleString()}
                    </td>
                  </tr>
                ))}
                {FetchDataRecent.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      No recent orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
