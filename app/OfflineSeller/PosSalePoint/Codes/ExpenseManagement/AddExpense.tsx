"use client";
import { useState } from "react";

export default function ExpenseAddForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [ExpenseName, setExpenseName] = useState("");
  const [ExpenseAmount, setExpenseAmount] = useState("");
  const [ExpenseDate, setExpenseDate] = useState("");
  const [ExpenseType, setExpenseType] = useState("");
  const [Description, setDescription] = useState("");
  return (
    <>
      <div className="w-full flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:max-w-md space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Expense Date
            </label>
            <input
              type="date"
              value={ExpenseDate}
              onChange={(e) => setExpenseDate(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none transition"
              placeholder="Expense Date"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Expense Name
            </label>
            <input
              type="text"
              value={ExpenseName}
              onChange={(e) => setExpenseName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none transition"
              placeholder="Expense Name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Expense Amount
            </label>
            <input
              type="text"
              value={ExpenseAmount}
              onChange={(e) => setExpenseAmount(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none transition"
              placeholder="Expense Amount"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Expense Type
            </label>
            <select
              value={ExpenseType}
              onChange={(e) => setExpenseType(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none transition"
            >
              <option>Select Type</option>
              <option>Utility</option>
              <option>Rent</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Description
            </label>
            <textarea
              value={Description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none transition"
              placeholder="Description"
            />
          </div>
          <div className="flex justify-end">
            <button
              //onClick={ModifyTill}
              className="px-6 py-2 rounded-xl bg-neutral-900 text-white font-medium hover:bg-neutral-800 transition shadow-lg"
            >
              {isLoading ? "Saving..." : "Save "}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
