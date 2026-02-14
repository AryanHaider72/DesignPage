"use client";
import { List, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import GetCity from "./GetCity";
import MessagePopUp from "@/app/UsefullComponent/MessagePopup/page";
import GetCountry from "@/api/lib/Admin/Country/countryGet";
import {
  Countryget,
  CountrygetApiResponse,
} from "@/api/types/Admin/Country/country";
import GetRegionApi from "@/api/lib/Admin/Shipment/Region/getRegion";
import {
  regionlist,
  responseRegionList,
} from "@/api/types/Admin/Shipment/Region/Region";
import AddZone from "@/api/lib/Admin/Shipment/City/CityAdd/CityAdd";
import AddCity from "./AddCity";
import { zonelist } from "@/api/types/Admin/Shipment/City/City";

export default function ShipmentCity() {
  const [view, setView] = useState<"list" | "form">("list");
  const [update, setUpdate] = useState(false);
  const [showMessage, setShowMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success",
  );
  const [cityList, setCityList] = useState<zonelist>();
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
            <GetCity
              onEdit={(till, id) => {
                setCityList(till);
                setView("form");
                setUpdate(true);
              }}
            />
          )}

          {/* Form View */}
          {view === "form" && (
            <AddCity
              initialData={cityList}
              Update={update}
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
