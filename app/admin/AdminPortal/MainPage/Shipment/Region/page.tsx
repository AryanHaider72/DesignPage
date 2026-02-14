"use client";
import { List, Plus } from "lucide-react";
import { useState } from "react";

export default function ShipmentRegion() {
  const [view, setView] = useState<"list" | "form">("list");
  const [countryID, setCountryID] = useState("");
  const [cities, setCities] = useState<string[]>([
    "Karachi",
    "Lahore",
    "Islamabad",
  ]);
  const [RegionName, setRegionName] = useState("");
  const Countries = [
    { countryID: "1", countryName: "pakistan" },
    { countryID: "3", countryName: "USA" },
    { countryID: "3", countryName: "india" },
  ];
  return (
    <>
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
            Region Management
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
                  Country
                </label>
                <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
                  <select
                    value={countryID}
                    name="CategoryMain"
                    className="w-full bg-transparent outline-none text-gray-900 p-1"
                    onChange={(e) => setCountryID(e.target.value)}
                  >
                    {Countries.map((cat) => (
                      <option key={cat.countryID} value={cat.countryID}>
                        {cat.countryName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Region Name
                </label>
                <input
                  type="text"
                  value={RegionName}
                  onChange={(e) => setRegionName(e.target.value)}
                  placeholder="Enter region name"
                  className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none transition"
                />
              </div>

              <div className="flex justify-end">
                <button className="px-6 py-2 rounded-xl bg-neutral-900 text-white font-medium hover:bg-neutral-800 transition shadow-lg">
                  Save
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
