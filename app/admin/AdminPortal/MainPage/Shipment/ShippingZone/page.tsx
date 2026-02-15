"use client";
import { List, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import AddShippingZone from "./AddShippingZone";
import {
  Countryget,
  CountrygetApiResponse,
} from "@/api/types/Admin/Country/country";
import GetCountry from "@/api/lib/Admin/Country/countryGet";
import GetRegionApi from "@/api/lib/Admin/Shipment/Region/getRegion";
import {
  regionlist,
  responseRegionList,
} from "@/api/types/Admin/Shipment/Region/Region";
export default function ShippingZone() {
  const [view, setView] = useState<"list" | "form">("list");
  const [countryID, setCountryID] = useState("");
  const [RegionList, setRegionList] = useState<regionlist[]>([]);

  const [Countries, setCountries] = useState<Countryget[]>([]);
  const [cities, setCities] = useState<string[]>([
    "Karachi",
    "Lahore",
    "Islamabad",
  ]);
  const [regionName, setRegionName] = useState("");
  const getCountry = async () => {
    const token = localStorage.getItem("token");
    const response = await GetCountry(String(token));
    if (response.status === 201 || response.status === 200) {
      const data = response.data as CountrygetApiResponse;
      setCountries(data.countryList);
    }
  };
  const getRegion = async (ID: string) => {
    const token = localStorage.getItem("adminToken");
    const response = await GetRegionApi(ID, String(token));
    const data = response.data as responseRegionList;
    setRegionList(data.regionlist);
    console.log(data.regionlist);
  };
  useEffect(() => {
    getCountry();
  }, []);
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
          Shipping-Zone Management
        </h1>
      </div>
      <div className="rounded-3xl bg-white/70 backdrop-blur-xl p-6 shadow-[0_20px_40px_rgba(0,0,0,0.07)] transition-all">
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
          <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
            <select
              value={regionName}
              name="CategoryMain"
              className="w-full bg-transparent outline-none text-gray-900 p-1"
              onChange={(e) => setRegionName(e.target.value)}
            >
              {RegionList.map((cat) => (
                <option key={cat.regionID} value={cat.regionID}>
                  {cat.regionName}
                </option>
              ))}
            </select>
          </div>
        </div>
        {/* <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Zone Name
          </label>
          <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
            <select
              value={CityName}
              name="CategoryMain"
              className="w-full bg-transparent outline-none text-gray-900 p-1"
              onChange={(e) => setCityName(e.target.value)}
            >
              {cities.map((cat, index) => (
                <option key={index} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div> */}
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
        {view === "form" && <AddShippingZone countryList={Countries} />}
      </div>
    </div>
  );
}
