"use client";
import GetCustomer from "@/api/lib/PosIntegration/Customer/GetCustomer/GetCustomer";
import AddLedgerCustomer from "@/api/lib/PosIntegration/Ledger/AddLedgerRecord/AddLedgerRecord";
import LedgerGetArrear from "@/api/lib/PosIntegration/Ledger/GetLedgerArrear/GetLedgerArrear";
import {
  CustomerData,
  ResponseCustomerGetData,
} from "@/api/types/Posintegration/Customer";
import { useEffect, useState } from "react";
interface AddExpenseProps {
  //   initialData?: ExpenseData | null;
  Update: boolean;
  onShowMessage: (message: any, type: "success" | "error") => void;
}

export default function AddLedgerRecord({
  Update,
  onShowMessage,
}: AddExpenseProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [Arrear, setArrear] = useState(0);
  const [CustomerID, setCustomerID] = useState("");
  const [CustomerName, setCustomerName] = useState("");
  const [customerList, setCustomerList] = useState<CustomerData[]>([]);
  const [PaymentDate, setPaymentDate] = useState("");
  const [Amount, setAmount] = useState(0);
  const [Description, setDescription] = useState("");

  const CustomerGet = async () => {
    const token = localStorage.getItem("posSellerToken");
    const response = await GetCustomer(String(token));
    if (response.status === 200 || response.status === 201) {
      const data = response.data as ResponseCustomerGetData;
      setCustomerList(data.customerList);
    } else {
      setCustomerList([]);
    }
  };
  const filteredOptions = customerList.filter((opt) =>
    opt.customerName.toLowerCase().includes(CustomerName.toLowerCase()),
  );
  const FetchArrear = async (ID: string) => {
    const token = localStorage.getItem("posSellerToken");
    const response = await LedgerGetArrear(String(token), ID);
    if (response.status === 200) {
      const data = response.data as any;
      setArrear(data.arrear);
    } else {
      setArrear(0);
    }
  };

  const AddLedgerRecord = async () => {
    try {
      const token = localStorage.getItem("posSellerToken");
      const formData = {
        customerID: CustomerID,
        postingDate: PaymentDate,
        amount: Amount,
        remarks: Description,
      };
      const response = await AddLedgerCustomer(formData, String(token));
      if (response.status === 200 || response.status === 201) {
        setDescription("");
        setAmount(0);
        FetchArrear(CustomerID);
        onShowMessage(
          response.message || "Record Added successfully",
          "success",
        );
      } else {
        onShowMessage(response.message, "error");
      }
    } catch (error: unknown) {
      onShowMessage(error, "error");
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    CustomerGet();
  }, []);
  return (
    <>
      <div className="w-full flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:max-w-md space-y-4">
          <div className="relative ">
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Customer Name
            </label>
            <input
              type="text"
              value={CustomerName}
              onChange={(e) => {
                const value = e.target.value;
                setCustomerName(value);
                setOpen(true);
                const data = customerList.find(
                  (item) => item.customerName === value,
                );
                if (data) {
                  setCustomerID(data.customerID);
                  FetchArrear(data.customerID);
                }
              }}
              onFocus={() => setOpen(true)}
              onBlur={() => setTimeout(() => setOpen(false), 100)} // Delay to allow click
              placeholder="Select Customer"
              className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none transition"
            />
            {open && filteredOptions.length > 0 && (
              <ul className="absolute z-10 w-full bg-white border border-neutral-200 rounded mt-1 shadow-sm max-h-40 overflow-auto">
                {filteredOptions.map((opt, index) => (
                  <li
                    key={index}
                    onMouseDown={() => {
                      setCustomerName(opt.customerName);
                      setCustomerID(opt.customerID);
                      FetchArrear(opt.customerID);
                      setOpen(false);
                    }}
                    className="px-4 py-2 cursor-pointer hover:bg-neutral-100"
                  >
                    {opt.customerName}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Arrear
            </label>
            <input
              type="text"
              value={Arrear}
              readOnly
              className="w-full text-right px-4 py-2 rounded-lg border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none transition"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Date
            </label>
            <input
              type="date"
              value={PaymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              className="w-full text-right px-4 py-2 rounded-lg border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none transition"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Amount
            </label>
            <input
              type="number"
              value={Amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none transition"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Description
            </label>
            <textarea
              value={Description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full  px-4 py-2 rounded-lg border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none transition"
              placeholder="Enter description"
            />
          </div>
          {Update ? (
            <div className="flex justify-end">
              <button
                //onClick={ModifyExpense}
                className="px-6 py-2 rounded-xl bg-neutral-900 text-white font-medium hover:bg-neutral-800 transition shadow-lg"
              >
                {isLoading ? "Updating..." : "Update"}
              </button>
            </div>
          ) : (
            <div className="flex justify-end">
              <button
                onClick={AddLedgerRecord}
                className="px-6 py-2 rounded-xl bg-neutral-900 text-white font-medium hover:bg-neutral-800 transition shadow-lg"
              >
                {isLoading ? "Saving..." : "Save"}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
