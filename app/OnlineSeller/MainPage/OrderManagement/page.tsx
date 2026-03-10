"use client";
import GetInitalStoreSalesMan from "@/api/lib/Admin/Stores/GetInitalStore/GetInitalStore";
import SellerOrderGet from "@/api/lib/OnlineSeller/Order/OrderGet/OrderGet";
import {
  ResponseStoreList,
  storeListInital,
} from "@/api/types/Admin/Store/Store";
import { useEffect, useState } from "react";

export default function OrderManagement() {
  const [storeList, setStoreList] = useState<storeListInital[]>([]);
  const [storeID, setStoreID] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const getStores = async () => {
    const token = localStorage.getItem("OnlineSellerToken");
    const response = await GetInitalStoreSalesMan(String(token));
    const data = response.data as ResponseStoreList;
    if (data.storeList.length > 0) {
      setStoreList(data.storeList);
      setStoreID(data.storeList[0].storeID);
    } else {
      setStoreList([]);
    }
  };
  const getOrderForSeller = async () => {
    const response = await SellerOrderGet("", "");
  };

  useEffect(() => {
    getStores();
  }, []);
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-neutral-900">
          Order Management
        </h1>
      </div>
      <div className="rounded-3xl bg-white/70 backdrop-blur-xl p-6 shadow-[0_20px_40px_rgba(0,0,0,0.07)] transition-all">
        <div className="flex gap-2 ">
          <div className="w-full  space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Stores
              </label>
              <select
                value={storeID}
                onChange={(e) => {
                  setStoreID(e.target.value);
                }}
                className="w-full px-4 py-3 rounded-lg border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none transition"
              >
                {storeList.length === 0 ? (
                  <option> No Stores Found</option>
                ) : (
                  <>
                    <option>Select Store</option>
                    {storeList.map((item) => (
                      <option key={item.storeID} value={item.storeID}>
                        {item.storeName}
                      </option>
                    ))}
                  </>
                )}
              </select>
            </div>
          </div>
          <div className="w-full  space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                }}
                className="w-full px-4 py-3 rounded-lg border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none transition"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="Delivered">Delivered</option>
                <option value="Canceled">Canceled</option>
                <option value="Shipped">Shipped</option>
              </select>
            </div>
          </div>
        </div>
        <div className="flex gap-2 mt-2">
          <div className="w-full">
            <label className="block text-gray-700 font-medium mb-2">
              Date From
            </label>
            <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50">
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full bg-transparent outline-none text-gray-900"
              />
            </div>
          </div>
          <div className="w-full">
            <label className="block text-gray-700 font-medium mb-2">
              Date To
            </label>
            <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50">
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full bg-transparent outline-none text-gray-900"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
