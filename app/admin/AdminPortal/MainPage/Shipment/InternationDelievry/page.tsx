"use client";
import { List, Plane, Plus, Truck } from "lucide-react";
import { useState } from "react";
import InternationDelievryAddForm from "./InternationDelievryAddForm";
import LocalRatesForm from "./LocalRatesForm";
import MessagePopUp from "@/app/UsefullComponent/MessagePopup/page";

export default function InternationDelievry() {
  const [view, setView] = useState<"list" | "form">("list");
  const [update, setUpdate] = useState(false);
  const [showMessage, setShowMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success",
  );
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
            <Truck size={18} />
            Local Rates
          </button>

          <button
            onClick={() => setView("form")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition
            ${view === "form" ? "bg-neutral-900 text-white" : "bg-white text-neutral-900 shadow hover:shadow-lg"}`}
          >
            <Plane size={18} />
            International Rates
          </button>
        </div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-neutral-900">
            Delivery Rates
          </h1>
        </div>
        <div className="rounded-3xl bg-white/70 backdrop-blur-xl p-6 shadow-[0_20px_40px_rgba(0,0,0,0.07)] transition-all">
          {view === "form" && (
            <InternationDelievryAddForm
              onShowMessage={(msg, type) => {
                setShowMessage(msg);
                setMessageType(type);
                if (type === "success") setView("form");
              }}
            />
          )}
          {view === "list" && (
            <LocalRatesForm
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
