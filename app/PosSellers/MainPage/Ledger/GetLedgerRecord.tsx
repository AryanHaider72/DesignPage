import GetCustomer from "@/api/lib/PosIntegration/Customer/GetCustomer/GetCustomer";
import DeleteledgerCustomer from "@/api/lib/PosIntegration/Ledger/DeleteLedeger/DeleteLedegerRecord";
import GetledgerCustomer from "@/api/lib/PosIntegration/Ledger/GetLedegerRecord/GetLedegerRecord";
import {
  CustomerData,
  ResponseCustomerGetData,
} from "@/api/types/Posintegration/Customer";
import {
  CustomerLedgerGet,
  ResponseCustomerLedgerGet,
} from "@/api/types/Posintegration/Ledger/Ledger";
import DeleteComponent from "@/app/UsefullComponent/DeleteComponent/page";
import Spinner from "@/app/UsefullComponent/Spinner/page";
import { Pencil, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
interface AddExpenseProps {
  onShowMessage: (message: any, type: "success" | "error") => void;
}
export default function GetLedegrRecordForCustomer({
  onShowMessage,
}: AddExpenseProps) {
  const [open, setOpen] = useState(false);
  const [ID, setID] = useState("");
  const [Delete, setDelete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [CustomerID, setCustomerID] = useState("");
  const [CustomerName, setCustomerName] = useState("");
  const [DateFrom, setDateFrom] = useState("");
  const [DateTo, setDateTo] = useState("");
  const [customerList, setCustomerList] = useState<CustomerData[]>([]);
  const [LedgerList, setLedgerList] = useState<CustomerLedgerGet[]>([]);

  const exportPDF = () => {
    const doc = new jsPDF();

    // Remaining Balance
    const remainingBalance =
      LedgerList.find((item) => item.entryType === "Remaning Amount")
        ?.creditAmount || 0;

    // Title
    doc.setFontSize(16);
    doc.text("Customer Ledger", 105, 15, { align: "center" });

    // Date Range
    doc.setFontSize(10);
    doc.text(`Date From: ${DateFrom}`, 14, 25);
    doc.text(`Date To: ${DateTo}`, 14, 30);

    // Remaining Balance (Top Right)
    doc.text(
      `Remaining Balance: ${remainingBalance.toLocaleString()}`,
      196,
      25,
      { align: "right" },
    );

    // Prepare Table Data
    const tableData = filterRecord.map((item, index) => {
      const prevBalance =
        index === 0
          ? 0
          : filterRecord
              .slice(0, index)
              .reduce((sum, r) => sum + (r.creditAmount - r.debitAmount), 0);

      const balance = prevBalance + (item.creditAmount - item.debitAmount);

      return [
        index + 1,
        item.postingDate
          ? new Date(item.postingDate).toLocaleDateString()
          : "-",
        item.entryType,
        item.debitAmount?.toLocaleString(),
        item.creditAmount?.toLocaleString(),
        balance.toLocaleString(),
      ];
    });

    // Table
    autoTable(doc, {
      startY: 35,
      head: [["#", "Posting Date", "Entry Type", "Debit", "Credit", "Balance"]],
      body: tableData,
    });

    // Save PDF
    doc.save(`Customer_Ledger_${CustomerName}.pdf`);
  };
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

  const CustomerLedger = async (ID: string) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("posSellerToken");
      const formData = {
        dateFrom: DateFrom,
        dateTo: DateTo,
      };
      const response = await GetledgerCustomer(formData, ID, String(token));
      if (response.status === 200 || response.status === 201) {
        const data = response.data as ResponseCustomerLedgerGet;
        console.log(data);
        setLedgerList(data.ledgerList);
      } else {
        setLedgerList([]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const ExpenseDelete = async (ID: string) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("posSellerToken");
      const response = await DeleteledgerCustomer(ID, String(token));
      if (response.status === 200 || response.status === 201) {
        setLedgerList((item) => item.filter((emp) => emp.ledgerID !== ID));
        setDelete(false);
        setID("");
      } else {
        setDelete(false);
        onShowMessage(
          response.message || "An Error Occured while Deleting.",
          "error",
        );
      }
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    CustomerLedger(CustomerID);
  }, [DateFrom, DateTo, CustomerID]);

  useEffect(() => {
    const today = new Date();
    const dateTo = today.toISOString().split("T")[0];

    const pastDate = new Date();
    pastDate.setDate(today.getDate() - 30);
    const dateFrom = pastDate.toISOString().split("T")[0];

    setDateTo(dateTo);
    setDateFrom(dateFrom);
    CustomerGet();
  }, []);
  const filterRecord = LedgerList.filter(
    (item) => item.entryType !== "Remaning Amount",
  );
  return (
    <>
      {Delete && (
        <DeleteComponent
          onCancel={() => {
            setDelete(false);
            setID("");
          }}
          onConfirm={() => ExpenseDelete(ID)}
        />
      )}
      <div>
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
        <div className="flex gap-5 mt-5">
          <div className="w-full">
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Date From
            </label>
            <input
              type="date"
              value={DateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full text-right px-4 py-2 rounded-lg border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none transition"
              placeholder="0"
            />
          </div>
          <div className="w-full">
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Date To
            </label>
            <input
              type="date"
              value={DateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full text-right px-4 py-2 rounded-lg border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none transition"
              placeholder="0"
            />
          </div>
        </div>
      </div>
      <div className="w-full flex justify-end">
        <button
          onClick={exportPDF}
          className="mt-10 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
        >
          Export PDF
        </button>
      </div>
      {isLoading ? (
        <div className="flex justify-center py-10">
          <Spinner />
        </div>
      ) : (
        <>
          <div className="relative overflow-x-auto bg-white shadow-sm mt-10 mb-10 border border-gray-300 rounded-md">
            {/* Ledger Header */}
            <div className="flex justify-between items-center px-6 py-3 bg-neutral-secondary-soft border-b border-gray-300">
              <h2 className="font-semibold text-lg">Customer Ledger</h2>

              <div className="text-right">
                <span className="text-sm text-gray-500">Remaining Balance</span>
                <p className="font-semibold text-lg">
                  {
                    LedgerList.find(
                      (item) => item.entryType === "Remaning Amount",
                    )?.creditAmount
                  }
                </p>
              </div>
            </div>

            <table className="w-full text-sm text-left text-body">
              <thead className="bg-neutral-primary-soft border-b border-gray-300">
                <tr>
                  <th className="px-4 py-3 font-medium">#</th>
                  <th className="px-4 py-3 font-medium">Posting Date</th>
                  <th className="px-4 py-3 font-medium">Entry Type</th>
                  <th className="px-4 py-3 font-medium text-right">Debit</th>
                  <th className="px-4 py-3 font-medium text-right">Credit</th>
                  <th className="px-4 py-3 font-medium text-right">Balance</th>
                  <th className="px-4 py-3 font-medium text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {filterRecord.length > 0 ? (
                  filterRecord.map((item, index) => {
                    const prevBalance =
                      index === 0
                        ? 0
                        : filterRecord
                            .slice(0, index)
                            .reduce(
                              (sum, r) =>
                                sum + (r.creditAmount - r.debitAmount),
                              0,
                            );

                    const balance =
                      prevBalance + (item.creditAmount - item.debitAmount);

                    return (
                      <tr
                        key={index}
                        className="border-b border-gray-200 hover:bg-gray-50"
                      >
                        <td className="px-4 py-3">{index + 1}</td>

                        <td className="px-4 py-3">
                          {item.postingDate
                            ? new Date(item.postingDate).toLocaleDateString()
                            : "-"}
                        </td>

                        <td className="px-4 py-3">{item.entryType}</td>

                        <td className="px-4 py-3 text-right">
                          {item.debitAmount?.toLocaleString()}
                        </td>

                        <td className="px-4 py-3 text-right">
                          {item.creditAmount?.toLocaleString()}
                        </td>

                        <td className="px-4 py-3 text-right font-medium">
                          {balance.toLocaleString()}
                        </td>
                        <td className="px-4 py-3">
                          {item.entryType === "Ledger" && (
                            <div className="flex justify-center gap-2">
                              {/* <button className="flex items-center px-2 py-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-50">
                                <Pencil size={20} />
                              </button> */}

                              <button
                                onClick={() => {
                                  setDelete(true);
                                  setID(item.ledgerID);
                                }}
                                className="flex items-center px-2 py-2 text-red-600 border border-red-600 rounded hover:bg-red-50"
                              >
                                <Trash size={20} />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center py-6 text-gray-500">
                      No Record Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
}
