"use client";
import ProductSearchParam from "@/api/lib/ProductSearchParam/ProductSearchParam";
import {
  ProductFetchRepsonse,
  productList,
} from "@/api/types/Admin/SearchProduct/SearchProduct";
import { useEffect, useState } from "react";

interface Item {
  id: number;
  name: string;
  price: number;
  stock: number;
}
export default function AddTillForm() {
  const [tillName, setTillName] = useState("");
  const [ProductName, setProductName] = useState("");
  const [VarientName, setVarientName] = useState("");
  const [SubVarientName, setSubVarientName] = useState("");
  const [attributeID, setAttributeID] = useState("");
  const [ProductID, setProductID] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const [productList, setProductList] = useState<productList[]>([]);
  const [items, setItems] = useState<Item[]>([
    { id: 1, name: "iPhone 14", price: 120000, stock: 5 },
    { id: 2, name: "AirPods Pro", price: 35000, stock: 12 },
  ]);

  const productFetch = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const respone = await ProductSearchParam(String(token), ProductName);
      const data = respone.data as ProductFetchRepsonse;
      setProductList(data.productList);
    } finally {
    }
  };

  const FetchVarinet = (ID: string) => {
    const data = productList.find((item) => item.productID === ID);
    if (data) {
      console.log(data);
    }
  };

  useEffect(() => {
    if (!ProductName || ProductName.trim().length === 0) return;

    const delayDebounce = setTimeout(() => {
      productFetch();
    }, 500); // ⏱ 500ms debounce

    return () => clearTimeout(delayDebounce); // cleanup
  }, [ProductName]);

  return (
    <>
      <div className="w-full flex flex-col lg:flex-row gap-8">
        {/* FORM */}
        <div className="w-full lg:max-w-md space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Till Name
            </label>
            <input
              type="text"
              value={tillName}
              onChange={(e) => setTillName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none transition"
              placeholder="Till Name"
            />
          </div>

          <div className="relative w-full">
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Product Name
            </label>

            <input
              type="text"
              value={ProductName}
              onChange={(e) => {
                setProductName(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => productList.length && setShowDropdown(true)}
              className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none transition"
              placeholder="Search product..."
            />

            {/* LOADER */}
            {isLoading && (
              <div className="absolute right-3 top-9">
                <div className="w-4 h-4 border-2 border-neutral-300 border-t-neutral-900 rounded-full animate-spin" />
              </div>
            )}

            {/* DROPDOWN */}
            {ProductName && showDropdown && productList.length > 0 && (
              <div
                className="absolute z-50 mt-2 w-full bg-white
                 rounded-xl shadow-xl shadow-neutral-300/40
                 max-h-80 overflow-y-auto"
              >
                {productList.map((item) => (
                  <div
                    key={item.productID}
                    onClick={() => {
                      setProductName(item.productName);
                      setProductID(item.productID);
                      setShowDropdown(false);
                    }}
                    className="flex items-center gap-3 px-4 py-3 cursor-pointer
                     hover:bg-neutral-100 transition"
                  >
                    <img
                      src={item.images?.[0]?.url || "/placeholder.png"}
                      alt={item.productName}
                      className="w-10 h-10 rounded-lg object-cover shadow-sm"
                    />

                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-neutral-900">
                        {item.productName}
                      </span>
                      <span className="text-xs text-neutral-500">
                        {item.storeName}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Variant Name
            </label>
            <input
              type="text"
              value={VarientName}
              onChange={(e) => setVarientName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none transition"
              placeholder="Variant Name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              SubVariant Name
            </label>
            <input
              type="text"
              value={SubVarientName}
              onChange={(e) => setSubVarientName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none transition"
              placeholder="SubVariant Name"
            />
          </div>

          <div className="flex justify-end">
            <button className="px-6 py-2 rounded-xl bg-neutral-900 text-white font-medium hover:bg-neutral-800 transition shadow-lg">
              Add Item
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="py-3 px-4 text-sm text-neutral-500">ID</th>
                <th className="py-3 px-4 text-sm text-neutral-500">Name</th>
                <th className="py-3 px-4 text-sm text-neutral-500">Price</th>
                <th className="py-3 px-4 text-sm text-neutral-500">Stock</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-neutral-100 hover:bg-neutral-100/50 transition"
                >
                  <td className="py-3 px-4">{item.id}</td>
                  <td className="py-3 px-4">{item.name}</td>
                  <td className="py-3 px-4">PKR {item.price}</td>
                  <td className="py-3 px-4">{item.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
