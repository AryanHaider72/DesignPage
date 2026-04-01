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
import { useRouter } from "next/navigation";

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

export default function OfflineSellerDashboard() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [storeList, setStoreList] = useState<storeInital[]>([]);
  const [ShowStore, setShowStore] = useState(false);

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

  return (
    <div className="min-h-screen  from-neutral-50 via-white to-neutral-100 p-8 space-y-12 overflow-y-hidden"></div>
  );
}
