"use client";
import { List, Plus } from "lucide-react";
import { useState } from "react";
import ExpenseAddForm from "./AddExpense";
import MessagePopUp from "@/app/UsefullComponent/MessagePopup/page";
import GetExpenseList from "./GetExpense";
import { ExpenseData } from "@/api/types/Posintegration/Expense";

export default function PosSalePointExpense() {
  const [ExpenseList, setExpenseList] = useState<ExpenseData>();
  const [showMessage, setShowMessage] = useState<string | null>(null);
  const [Update, setUpdate] = useState(false);
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success",
  );
  const [view, setView] = useState<"list" | "form">("list");
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
              setView("list");
              setUpdate(false);
              setExpenseList(undefined);
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
            Expense Management
          </h1>
        </div>
        <div className="rounded-3xl bg-white/70 backdrop-blur-xl p-6 shadow-[0_20px_40px_rgba(0,0,0,0.07)] transition-all">
          {view === "form" && (
            <ExpenseAddForm
              initialData={ExpenseList}
              Update={Update}
              onShowMessage={(msg, type) => {
                setShowMessage(msg);
                setMessageType(type);
                if (type === "success") setView("list");
              }}
            />
          )}
          {view === "list" && (
            <GetExpenseList
              onShowMessage={(msg, type) => {
                setShowMessage(msg);
                setMessageType(type);
                if (type === "success") setView("list");
              }}
              onEdit={(data: ExpenseData) => {
                setExpenseList(data);
                setUpdate(true);
                setView("form");
              }}
            />
          )}
        </div>
      </div>
    </>
  );
}
