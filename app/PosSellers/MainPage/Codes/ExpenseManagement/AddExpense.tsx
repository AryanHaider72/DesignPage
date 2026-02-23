"use client";
import AddExpense from "@/api/lib/PosIntegration/Expense/AddExpense/AddExpense";
import GetExpenseListType from "@/api/lib/PosIntegration/Expense/GetExpenseType/GetExpenseType";
import ModifyExpenseApi from "@/api/lib/PosIntegration/Expense/ModifyExpense/ModifyExpense";
import { ExpenseData } from "@/api/types/Posintegration/Expense";
import { useEffect, useState } from "react";
interface expenseResponse {
  message: string;
  expenseTypeList: expenseTypeList[];
}
interface expenseTypeList {
  expenseType: string;
}
interface AddExpenseProps {
  initialData?: ExpenseData | null;
  Update: boolean;
  onShowMessage: (message: any, type: "success" | "error") => void;
}
export default function ExpenseAddForm({
  initialData,
  Update,
  onShowMessage,
}: AddExpenseProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [ExpenseName, setExpenseName] = useState("");

  const [ExpenseAmount, setExpenseAmount] = useState("");
  const [ExpenseDate, setExpenseDate] = useState("");
  const [ExpenseType, setExpenseType] = useState("");
  const [Description, setDescription] = useState("");
  const [expenseID, setExpenseID] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [ExpenseTypeList, setExpenseTypeList] = useState<expenseTypeList[]>([]);

  const addExpense = async () => {
    const token = localStorage.getItem("posSellerToken");
    try {
      setLoading(true);
      const formData = {
        expenseName: ExpenseName,
        expenseType: ExpenseType,
        amount: Number(ExpenseAmount),
        description: Description,
        expenseDate: ExpenseDate,
      };
      const response = await AddExpense(formData, String(token));
      if (response.status === 200 || response.status === 201) {
        ExpenseTypeListGet();
        setExpenseType("");
        setDescription("");
        setExpenseName("");
        setExpenseAmount("");
        onShowMessage(
          response.message || "Expense Added successfully",
          "success",
        );
      } else {
        onShowMessage(response.message, "error");
      }
    } catch (error: unknown) {
      onShowMessage(error, "error");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const ExpenseTypeListGet = async () => {
    try {
      const token = localStorage.getItem("posSellerToken");
      const response = await GetExpenseListType(String(token));
      if (response.status === 200 || response.status === 201) {
        const data = response.data as expenseResponse;
        console.log(data);
        setExpenseTypeList(data.expenseTypeList || []);
      }
    } finally {
      setIsLoading(false);
    }
  };
  const ModifyExpense = async () => {
    const token = localStorage.getItem("posSellerToken");
    try {
      setLoading(true);
      const formData = {
        expenseID: expenseID,
        expenseName: ExpenseName,
        expenseType: ExpenseType,
        amount: Number(ExpenseAmount),
        description: Description,
        expenseDate: ExpenseDate,
      };
      const response = await ModifyExpenseApi(formData, String(token));
      if (response.status === 200 || response.status === 201) {
        ExpenseTypeListGet();
        setExpenseID("");
        setExpenseType("");
        setDescription("");
        setExpenseName("");
        setExpenseAmount("");
        onShowMessage(
          response.message || "Expense Modified successfully",
          "success",
        );
      } else {
        onShowMessage(response.message, "error");
      }
    } catch (error: unknown) {
      onShowMessage(error, "error");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialData) {
      console.log(initialData);
      setExpenseAmount(String(initialData.amount));
      setExpenseDate(initialData.postingDate.split("T")[0]);
      setDescription(initialData.description);
      setExpenseType(initialData.expenseType);
      setExpenseName(initialData.expenseName);
      setExpenseID(initialData.expenseID);
    }
  }, [initialData]);
  useEffect(() => {
    if (!Update) {
      const date = new Date().toISOString().split("T")[0];
      setExpenseDate(date);
    }
  }, [Update]);
  useEffect(() => {
    ExpenseTypeListGet();
  }, []);

  const filteredOptions = ExpenseTypeList.filter((opt) =>
    opt.expenseType.toLowerCase().includes(ExpenseType.toLowerCase()),
  );

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

          <div className="relative ">
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Expense Type
            </label>
            <input
              type="text"
              value={ExpenseType}
              onChange={(e) => {
                setExpenseType(e.target.value);
                setOpen(true);
              }}
              onFocus={() => setOpen(true)}
              onBlur={() => setTimeout(() => setOpen(false), 100)} // Delay to allow click
              placeholder="Select Type"
              className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none transition"
            />
            {open && filteredOptions.length > 0 && (
              <ul className="absolute z-10 w-full bg-white border border-neutral-200 rounded mt-1 shadow-sm max-h-40 overflow-auto">
                {filteredOptions.map((opt, index) => (
                  <li
                    key={index}
                    onMouseDown={() => {
                      setExpenseType(opt.expenseType);
                      setOpen(false);
                    }}
                    className="px-4 py-2 cursor-pointer hover:bg-neutral-100"
                  >
                    {opt.expenseType}
                  </li>
                ))}
              </ul>
            )}
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
          {Update ? (
            <div className="flex justify-end">
              <button
                onClick={ModifyExpense}
                className="px-6 py-2 rounded-xl bg-neutral-900 text-white font-medium hover:bg-neutral-800 transition shadow-lg"
              >
                {loading ? "Updating..." : "Update"}
              </button>
            </div>
          ) : (
            <div className="flex justify-end">
              <button
                onClick={addExpense}
                className="px-6 py-2 rounded-xl bg-neutral-900 text-white font-medium hover:bg-neutral-800 transition shadow-lg"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
