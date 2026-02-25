"use client";
import MessagePopUp from "@/app/UsefullComponent/MessagePopup/page";
import { List, Plus } from "lucide-react";
import { useState } from "react";
import AddFormUnit from "./AddFormUnit";
import { UnitList } from "@/api/types/Admin/Codes/Unit/Unit";
import GetFormUnit from "./GetFormUnit";
export default function UnitsManagement() {
  const [view, setView] = useState<"list" | "form">("list");
  const [showMessage, setShowMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success",
  );
  const [Update, setUpdate] = useState(false);
  const [UnitList, setUnitList] = useState<UnitList>();
  const [ID, setID] = useState("");
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
      <div>
        <div className="space-y-6">
          {/* Top Buttons */}
          <div className="w-full bg-gray-50 shadow-sm flex justify-between px-1 py-2 rounded-lg">
            <button
              onClick={() => {
                setView("list");
                setUpdate(false);
                setUnitList(undefined);
              }}
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
              Units Management
            </h1>
          </div>
          <div className="rounded-3xl bg-white/70 backdrop-blur-xl p-6 shadow-[0_20px_40px_rgba(0,0,0,0.07)] transition-all">
            {view === "form" && (
              <AddFormUnit
                initialData={UnitList}
                storeID={ID}
                Update={Update}
                onShowMessage={(msg, type) => {
                  setShowMessage(msg);
                  setMessageType(type);
                  if (type === "success") setView("list");
                }}
              />
            )}
            {view === "list" && (
              <GetFormUnit
                onShowMessage={(msg, type) => {
                  setShowMessage(msg);
                  setMessageType(type);
                  if (type === "success") setView("list");
                }}
                onEdit={(data: UnitList, storeID: string) => {
                  setUnitList(data);
                  setID(storeID);
                  setUpdate(true);
                  setView("form");
                }}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
