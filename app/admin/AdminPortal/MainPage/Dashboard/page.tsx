"use client";

import { useEffect, useState } from "react";
import { ShoppingCart, Users, Package, DollarSign, X } from "lucide-react";

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

/* ---------- DATA ---------- */

const stats = [
  { title: "Revenue", value: "PKR 12.4M", icon: DollarSign },
  { title: "Orders", value: "1,284", icon: ShoppingCart },
  { title: "Customers", value: "842", icon: Users },
  { title: "Products", value: "312", icon: Package },
];

const analyticsData = [
  { month: "Jan", revenue: 120000, profit: 32000 },
  { month: "Feb", revenue: 180000, profit: 52000 },
  { month: "Mar", revenue: 260000, profit: 78000 },
  { month: "Apr", revenue: 310000, profit: 92000 },
  { month: "May", revenue: 380000, profit: 112000 },
  { month: "Jun", revenue: 450000, profit: 148000 },
];

/* ---------- COMPONENT ---------- */

export default function AdminDashboard() {
  const [mounted, setMounted] = useState(false);
  const [storeList, setStoreList] = useState<storeInital[]>([]);
  const [ShowStore, setShowStore] = useState(false);

  const storesget = async () => {
    const token = localStorage.getItem("token");
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
                    {storeList.map((item) => (
                      <div
                        key={item.storeID}
                        onClick={() => {}}
                        className="relative bg-gray-50 shadow-md border border-gray-200 p-5 rounded-2xl 
                             hover:shadow-lg hover:-translate-y-1 hover:bg-white transition-all 
                             cursor-pointer text-center flex flex-col justify-center items-center"
                      >
                        {/* Store Image */}
                        {/* {item.imagelist?.length > 0 && (
                          <img
                            src={item.imagelist[0].imageUrl}
                            alt={item.storeName}
                            className="w-full h-32 object-cover rounded-md mb-3 pointer-events-none"
                          />
                        )} */}

                        {/* Store Name */}
                        <h3 className="text-lg font-semibold text-gray-900 pointer-events-none">
                          {item.storeName}
                        </h3>

                        {/* Badge (won’t block clicks) */}
                        <span
                          className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold 
                               w-5 h-5 flex items-center justify-center rounded-full shadow 
                               pointer-events-none"
                        >
                          2
                        </span>

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

        <button
          onClick={() => setShowStore(true)}
          className="px-5 py-2.5 rounded-xl bg-neutral-900 text-white text-sm
          shadow-lg shadow-black/10 hover:bg-neutral-800 transition"
        >
          + Add Stores
        </button>
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
        <div
          className="rounded-3xl bg-white/70 backdrop-blur-xl p-7
shadow-[0_20px_40px_rgba(0,0,0,0.07)]"
        >
          <h3 className="text-lg font-semibold mb-4">Monthly Revenue</h3>

          {mounted && (
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData}>
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

        {/* Profit */}
        <div
          className="rounded-3xl bg-white/70 backdrop-blur-xl p-7
          shadow-[0_20px_40px_rgba(0,0,0,0.07)]"
        >
          <h3 className="text-lg font-semibold mb-4">Profit Trend</h3>

          {mounted && (
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analyticsData}>
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Orders */}
        <div
          className="lg:col-span-2 rounded-3xl bg-white/70 backdrop-blur-xl p-7
          shadow-[0_20px_40px_rgba(0,0,0,0.07)]"
        >
          <h3 className="text-lg font-semibold mb-6">Recent Orders</h3>

          <div className="space-y-4 text-sm">
            {["#ORD-2411", "#ORD-2412", "#ORD-2413", "#ORD-2414"].map(
              (order) => (
                <div
                  key={order}
                  className="flex items-center justify-between p-4
                  rounded-xl hover:bg-neutral-100/60 transition"
                >
                  <span className="font-medium">{order}</span>
                  <span className="text-amber-600 bg-amber-100/60 px-3 py-1 rounded-full text-xs">
                    Pending
                  </span>
                  <span className="font-semibold">PKR 24,000</span>
                </div>
              ),
            )}
          </div>
        </div>

        {/* Stock */}
        <div
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
        </div>
      </div>
    </div>
  );
}
