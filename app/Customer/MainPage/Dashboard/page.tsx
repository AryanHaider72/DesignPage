"use client";

import { useEffect, useState } from "react";
import {
  ShoppingCart,
  Users,
  Package,
  DollarSign,
  X,
  Coins,
  Clock,
} from "lucide-react";

interface responseStats {
  message: string;
  stats: stats[];
}
interface stats {
  completedOrder: number;
  cancelledOrder: number;
  pendingOrder: number;
  totalOrder: number;
  shippingExpense: number;
  cashRecieved: number;
}
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
import { MdShoppingCartCheckout } from "react-icons/md";
import DashboardOverviewStatsCustoemr from "@/api/lib/Customer/DashboardStats/DashboardStats";

/* ---------- DATA ---------- */

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
  const [StateData, setStateData] = useState<stats>();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [storeList, setStoreList] = useState<storeInital[]>([]);
  const [ShowStore, setShowStore] = useState(false);

  useEffect(() => setMounted(true), [mounted]);

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
  const getStatsForAll = async () => {
    try {
      const token = localStorage.getItem("CustomerToken");
      const response = await DashboardOverviewStatsCustoemr(String(token));
      const data = response.data as responseStats;
      setStateData(data.stats[0]);
    } finally {
    }
  };
  useEffect(() => {
    getStatsForAll();
  }, []);
  return (
    <div className="min-h-screen  from-neutral-50 via-white to-neutral-100 p-8 space-y-12 overflow-y-hidden">
      <div
        className={`flex items-center justify-between transition-all duration-700
        ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
      >
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Customer Order Overview
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
    </div>
  );
}
