"use client";

import { useState } from "react";
import { Plus, List } from "lucide-react";

interface Item {
  id: number;
  name: string;
  price: number;
  stock: number;
}

export default function AdminItems() {
  const [view, setView] = useState<"list" | "form">("list");
  const [items, setItems] = useState<Item[]>([
    { id: 1, name: "iPhone 14", price: 120000, stock: 5 },
    { id: 2, name: "AirPods Pro", price: 35000, stock: 12 },
  ]);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
  });

  const handleAdd = () => {
    const newItem: Item = {
      id: items.length + 1,
      name: formData.name,
      price: Number(formData.price),
      stock: Number(formData.stock),
    };
    setItems([...items, newItem]);
    setFormData({ name: "", price: "", stock: "" });
    setView("list");
  };

  return (
    <div className="space-y-6">
      {/* Top Buttons */}
      <div className="w-full bg-gray-50 shadow-sm flex justify-between px-1 py-2 rounded-lg">
        <button
          onClick={() => setView("list")}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition
              ${view === "list" ? "bg-neutral-900 text-white" : "bg-white text-neutral-900 shadow hover:shadow-lg"}`}
        >
          <List size={18} />
          Show List
        </button>

        <button
          onClick={() => setView("form")}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition
              ${view === "form" ? "bg-neutral-900 text-white" : "bg-white text-neutral-900 shadow hover:shadow-lg"}`}
        >
          <Plus size={18} />
          Add New
        </button>
      </div>

      {/* Title */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-neutral-900">
          Create Login
        </h1>
      </div>

      {/* Body with smooth transition */}
      <div className="rounded-3xl bg-white/70 backdrop-blur-xl p-6 shadow-[0_20px_40px_rgba(0,0,0,0.07)] transition-all duration-500 ease-in-out">
        <div
          className={`transition-all duration-500 ease-in-out transform ${
            view === "list"
              ? "opacity-100 scale-100"
              : "opacity-0 scale-95 absolute"
          }`}
        >
          {/* List Table */}
          {view === "list" && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-neutral-200">
                    <th className="py-3 px-4 text-sm text-neutral-500">ID</th>
                    <th className="py-3 px-4 text-sm text-neutral-500">Name</th>
                    <th className="py-3 px-4 text-sm text-neutral-500">
                      Price
                    </th>
                    <th className="py-3 px-4 text-sm text-neutral-500">
                      Stock
                    </th>
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
          )}
        </div>

        <div
          className={`transition-all duration-500 ease-in-out transform ${
            view === "form"
              ? "opacity-100 scale-100"
              : "opacity-0 scale-95 absolute"
          }`}
        >
          {/* Form */}
          {view === "form" && (
            <div className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none transition"
                  placeholder="Item Name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Price
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none transition"
                  placeholder="PKR 0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Stock
                </label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData({ ...formData, stock: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none transition"
                  placeholder="0"
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleAdd}
                  className="px-6 py-2 rounded-xl bg-neutral-900 text-white font-medium hover:bg-neutral-800 transition shadow-lg"
                >
                  Add Item
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
