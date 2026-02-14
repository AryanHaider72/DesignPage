"use client";
import { List, Plus } from "lucide-react";
import { useState } from "react";

export default function ShipmentCity() {
  const [view, setView] = useState<"list" | "form">("list");
  const [cities, setCities] = useState<string[]>([
    "Karachi",
    "Lahore",
    "Islamabad",
  ]);
  const [cityName, setCityName] = useState("");

  const handleSave = () => {
    if (cityName.trim() === "") return; // prevent empty input
    setCities([...cities, cityName.trim()]);
    setCityName("");
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-neutral-900">
          City Management
        </h1>
      </div>

      {/* Body */}
      <div className="rounded-3xl bg-white/70 backdrop-blur-xl p-6 shadow-[0_20px_40px_rgba(0,0,0,0.07)] transition-all">
        {/* List View */}
        {view === "list" && (
          <div className="space-y-4">
            {cities.length === 0 ? (
              <p className="text-neutral-500">No cities added yet.</p>
            ) : (
              <ul className="divide-y divide-neutral-200">
                {cities.map((city, index) => (
                  <li
                    key={index}
                    className="py-2 px-4 hover:bg-neutral-100/50 rounded transition"
                  >
                    {city}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Form View */}
        {view === "form" && (
          <div className="max-w-md space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                City Name
              </label>
              <input
                type="text"
                value={cityName}
                onChange={(e) => setCityName(e.target.value)}
                placeholder="Enter city name"
                className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none transition"
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSave}
                className="px-6 py-2 rounded-xl bg-neutral-900 text-white font-medium hover:bg-neutral-800 transition shadow-lg"
              >
                Save
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
