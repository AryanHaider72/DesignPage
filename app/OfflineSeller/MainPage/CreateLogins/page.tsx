"use client";
import { List, Plus } from "lucide-react";
import { useState } from "react";
import AddLoginsOffline from "./AddLoginForm";

export default function CreateLogins() {
  const [view, setView] = useState<"list" | "form">("list");
  return (
    <>
      <div className="space-y-6">
        {/* Top Buttons */}
        <div className="w-full bg-gray-50 shadow-sm flex justify-between px-1 py-2 rounded-lg">
          <button
            onClick={() => {
              setView("list");
              //   setTillData(undefined);
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
            Create Logins
          </h1>
        </div>
        {/*  */}
        {view === "form" && <AddLoginsOffline />}
      </div>
    </>
  );
}
