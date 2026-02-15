"use client";
import { List, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import AddRegion from "./AddRegion";
import MessagePopUp from "@/app/UsefullComponent/MessagePopup/page";
import {
  Countryget,
  CountrygetApiResponse,
} from "@/api/types/Admin/Country/country";
import GetCountry from "@/api/lib/Admin/Country/countryGet";
import GetRegion from "./GetRegion";
import { regionlist } from "@/api/types/Admin/Shipment/Region/Region";

export default function ShipmentRegion() {
  const [view, setView] = useState<"list" | "form">("list");
  const [tillID, setTillID] = useState("");
  const [showMessage, setShowMessage] = useState<string | null>(null);
  const [update, setUpdate] = useState(false);
  const [Countries, setCountries] = useState<Countryget[]>([]);
  const [RegionList, setRegionList] = useState<regionlist>();
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success",
  );
  const [cities, setCities] = useState<string[]>([
    "Karachi",
    "Lahore",
    "Islamabad",
  ]);
  const getCountry = async () => {
    const token = localStorage.getItem("token");
    const response = await GetCountry(String(token));
    if (response.status === 201 || response.status === 200) {
      const data = response.data as CountrygetApiResponse;
      setCountries(data.countryList);
    }
  };
  useEffect(() => {
    getCountry();
  }, []);

  return (
    <>
      {showMessage && (
        <MessagePopUp
          message={showMessage}
          type={messageType}
          duration={3000}
          onClose={() => setShowMessage(null)}
        />
      )}
      <div className="space-y-6">
        {/* Top Buttons */}
        <div className="w-full bg-gray-50 shadow-sm flex justify-between px-1 py-2 rounded-lg">
          <button
            onClick={() => {
              setRegionList(undefined);
              setView("list");
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition
            ${view === "list" ? "bg-neutral-900 text-white" : "bg-white text-neutral-900 shadow hover:shadow-lg"}`}
          >
            <List size={18} />
            Show List
          </button>

          <button
            onClick={() => {
              setRegionList(undefined);
              setView("form");
            }}
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
            <GetRegion
              countryList={Countries}
              onEdit={(till, id) => {
                setRegionList(till);
                setTillID(id);
                setView("form");
                setUpdate(true);
              }}
            />
          )}

          {/* Form View */}
          {view === "form" && (
            <AddRegion
              TillID={tillID}
              Update={update}
              initialData={RegionList}
              countryList={Countries}
              onShowMessage={(msg, type) => {
                setShowMessage(msg);
                setMessageType(type);
                if (type === "success") setView("list");
              }}
            />
          )}
        </div>
      </div>
    </>
  );
}
