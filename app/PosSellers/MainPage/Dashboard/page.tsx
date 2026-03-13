"use client";

import { useEffect, useState } from "react";
import {
  ShoppingCart,
  Users,
  Package,
  DollarSign,
  X,
  Coins,
  GrapeIcon,
  BarChart2,
  Search,
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
import { GrGraphQl } from "react-icons/gr";
import { BiMoney } from "react-icons/bi";
import DashboardOverviewStats from "@/api/lib/PosIntegration/Dashboard/DashboardOverview";

/* ---------- DATA ---------- */

interface responseStats {
  message: string;
  stats: stats[];
  bargraph: bargraph[];
  recentSales: RecentSales[];
}
interface stats {
  queryTotalCredit: number;
  queryTotalExpense: number;
  queryTotalProduct: number;
  queryTotalReturn: number;
  queryTotalSale: number;
}
interface bargraph {
  saleYear: number;
  saleMonthName: string;
  totalSale: number;
  totalReturn: number;
}
interface RecentSales {
  qty: number;
  rate: number;
  barcode: number;
}

/* ---------- COMPONENT ---------- */

export default function OfflineSellerDashboard() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [storeList, setStoreList] = useState<storeInital[]>([]);
  const [FetchDataBar, setFetchDataBar] = useState<bargraph[]>([]);
  const [FetchDataRecent, setFetchDataRecent] = useState<RecentSales[]>([]);
  const [ShowStore, setShowStore] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [TotalSale, setTotalSale] = useState(0);
  const [TotalReturn, setTotalReturn] = useState(0);
  const [TotalExpense, setTotalExpense] = useState(0);
  const [TotalCredit, setTotalCredit] = useState(0);
  const [TotalProducts, setTotalProducts] = useState(0);

  const stats = [
    { title: "Total Sale", value: TotalSale, icon: ShoppingCart },
    { title: "Total Returns", value: TotalReturn, icon: Users },
    { title: "Total Credit", value: TotalCredit, icon: Users },
    { title: "Total Expense", value: TotalExpense, icon: Coins },
    { title: "Products", value: TotalProducts, icon: Package },
  ];
  const analyticsData = [
    { month: "Jan", revenue: 120000, profit: 32000 },
    { month: "Feb", revenue: 180000, profit: 52000 },
    { month: "Mar", revenue: 260000, profit: 78000 },
    { month: "Apr", revenue: 310000, profit: 92000 },
    { month: "May", revenue: 380000, profit: 112000 },
    { month: "Jun", revenue: 450000, profit: 148000 },
  ];
  const storesget = async () => {
    const token = localStorage.getItem("adminToken");
    const response = await GetInitalStoreSalesMan(String(token));
    if (response.status === 200 || response.status === 201) {
      const data = response.data as StoreApiResponse;
      console.log(data);
      setStoreList(data.storeList);
    }
  };
  useEffect(() => {
    storesget();
  }, []);
  useEffect(() => setMounted(true), [mounted]);

  const getStats = async (From: string, To: string) => {
    try {
      const token = localStorage.getItem("posSellerToken");
      const response = await DashboardOverviewStats(String(token), From, To);
      const data = response.data as responseStats;
      console.log(data);
      setFetchDataBar(data.bargraph);
      setFetchDataRecent(data.recentSales);
      setTotalProducts(data.stats[0].queryTotalProduct || 0);
      setTotalReturn(data.stats[0].queryTotalReturn || 0);
      setTotalExpense(data.stats[0].queryTotalExpense || 0);
      setTotalCredit(data.stats[0].queryTotalCredit || 0);
      setTotalSale(data.stats[0].queryTotalSale || 0);
    } finally {
    }
  };

  useEffect(() => {
    if (dateFrom && dateTo) {
      getStats(dateFrom, dateTo);
    }
  }, [dateFrom, dateTo]);
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
    <div className="min-h-screen  from-neutral-50 via-white to-neutral-100 p-8 space-y-12 overflow-y-hidden">
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

                        {/* Delete Button */}
                        {/* <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent navigating
                            console.log("Delete store:", item.storeID);
                            // Add your delete logic here
                          }}
                          className="absolute bottom-2 right-2 bg-red-600 text-white text-xs font-bold
                               w-6 h-6 flex items-center justify-center rounded-full shadow 
                               hover:bg-red-700"
                        >
                          ×
                        </button> */}
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

        {/* <button
          onClick={() => setShowStore(true)}
          className="px-5 py-2.5 rounded-xl bg-neutral-900 text-white text-sm
          shadow-lg shadow-black/10 hover:bg-neutral-800 transition"
        >
          + Add Stores
        </button> */}
      </div>
      <div className="w-full flex gap-5">
        {/* Date From */}
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
        hover:scale-105 hover:shadow-lg"
          >
            <div>
              <p className="text-xs uppercase tracking-wide text-neutral-500">
                {item.title}
              </p>
              <h2 className="text-2xl font-semibold mt-1">{item.value}</h2>
            </div>
            <item.icon className="h-9 w-9 text-neutral-700" />
          </div>
        ))}
      </div>

      {/* ANALYTICS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue */}
        {/* Revenue */}
        <div className="rounded-3xl bg-white/70 backdrop-blur-xl p-7 shadow-[0_20px_40px_rgba(0,0,0,0.07)]">
          <h3 className="text-lg font-semibold mb-4">Monthly Revenue</h3>

          {mounted && FetchDataBar.length > 0 ? (
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={FetchDataBar}
                  margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="saleMonthName" />
                  <YAxis />
                  <Tooltip
                    formatter={(value?: number, name?: string) => [
                      `PKR ${value?.toLocaleString() || 0}`,
                      name === "totalSale"
                        ? "Total Sale"
                        : name === "totalReturn"
                          ? "Total Return"
                          : "",
                    ]}
                  />
                  <Bar
                    dataKey="totalSale"
                    fill="#111827"
                    radius={[10, 10, 0, 0]}
                    name="Total Sale"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[320px] text-gray-400">
              No data available for this period.
            </div>
          )}
        </div>

        {/* Profit */}
        <div
          className="rounded-3xl bg-white/70 backdrop-blur-xl p-7
          shadow-[0_20px_40px_rgba(0,0,0,0.07)]"
        >
          <h3 className="text-lg font-semibold mb-4">Profit Trend</h3>

          {mounted && (
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={FetchDataBar}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="saleMonthName" />
                  <YAxis />
                  <Tooltip
                    formatter={(value?: number, name?: string) => [
                      `PKR ${value?.toLocaleString() || 0}`,
                      name === "totalSale"
                        ? "Total Sale"
                        : name === "totalReturn"
                          ? "Total Return"
                          : "",
                    ]}
                  />
                  <Line
                    type="monotone"
                    dataKey="totalSale"
                    stroke="#111827"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="totalReturn"
                    stroke="#f59e0b"
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
      <div className="w-full gap-8">
        {/* Orders */}
        <div className="lg:col-span-2 rounded-3xl bg-white/70 backdrop-blur-xl p-7 shadow-[0_20px_40px_rgba(0,0,0,0.07)]">
          <h3 className="text-lg font-semibold mb-6">Recent Orders</h3>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Barcode
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
                      {order.barcode}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {order.qty}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      PKR {order.rate}
                    </td>
                  </tr>
                ))}
                {FetchDataRecent.length === 0 && (
                  <tr>
                    <td
                      colSpan={3}
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

        {/* Stock */}
        {/* <div
          className="rounded-3xl bg-white/70 backdrop-blur-xl p-7
          shadow-[0_20px_40px_rgba(0,0,0,0.07)]"
        >
          <h3 className="text-lg font-semibold mb-6">Low Stock</h3>

          <ul className="space-y-4 text-sm">
            <li className="flex justify-between">
              <span>iPhone 14</span>
              <span className="text-red-500 font-medium">3 left</span>
            </li>
            <li className="flex justify-between">
              <span>AirPods Pro</span>
              <span className="text-red-500 font-medium">5 left</span>
            </li>
            <li className="flex justify-between">
              <span>MacBook Air</span>
              <span className="text-yellow-500 font-medium">8 left</span>
            </li>
          </ul>
        </div> */}
      </div>
    </div>
  );
}
