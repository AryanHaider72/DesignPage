"use client";
import DeleteExpense from "@/api/lib/PosIntegration/Expense/DeleteExpense/DeleteExpense";
import GetExpenseListData from "@/api/lib/PosIntegration/Expense/GetExpense/GetExpenseList";
import {
  ExpenseData,
  ResponseExpenseGetData,
} from "@/api/types/Posintegration/Expense";
import DeleteComponent from "@/app/UsefullComponent/DeleteComponent/page";
import Spinner from "@/app/UsefullComponent/Spinner/page";
import { Pencil, Trash } from "lucide-react";
import { useEffect, useState } from "react";
interface AddExpenseProps {
  onEdit: (Datalist: ExpenseData) => void;
  onShowMessage: (message: any, type: "success" | "error") => void;
}

export default function GetExpenseList({
  onShowMessage,
  onEdit,
}: AddExpenseProps) {
  const [ID, setID] = useState("");
  const [Delete, setDelete] = useState(false);
  const [isloading, setIsLoading] = useState(false);
  const [ExpenseList, setExpenseList] = useState<ExpenseData[]>([]);

  const ExpenseGet = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("posSellerToken");
      const response = await GetExpenseListData(String(token));
      if (response.status === 200 || response.status === 201) {
        const data = response.data as ResponseExpenseGetData;
        setExpenseList(data.expenseList);
      } else {
        setExpenseList([]);
      }
    } catch (err) {
      // setResponseBack(3);
    } finally {
      setIsLoading(false);
    }
  };
  const ExpenseDelete = async (ID: string) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("posSellerToken");
      const response = await DeleteExpense(ID, String(token));
      if (response.status === 200 || response.status === 201) {
        setExpenseList((item) => item.filter((emp) => emp.expenseID !== ID));
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
  const fetchData = (ID: string) => {
    const data = ExpenseList.find((item) => item.expenseID === ID);
    if (data) {
      const formData = {
        expenseID: data.expenseID,
        expenseName: data.expenseName,
        expenseType: data.expenseType,
        amount: data.amount,
        postingDate: data.postingDate,
        description: data.description,
      };
      onEdit(formData);
    }
  };

  useEffect(() => {
    ExpenseGet();
  }, []);
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
      {isloading ? (
        <div className="flex justify-center py-10">
          <Spinner />
        </div>
      ) : (
        <>
          {ExpenseList.length > 0 ? (
            <div className="space-y-4">
              {ExpenseList.map((item) => (
                <div
                  key={item.expenseID}
                  className="flex items-center justify-between bg-white shadow-md rounded-lg p-4 hover:shadow-xl transition relative"
                >
                  {/* Left: Till Info */}
                  <div className="flex flex-col">
                    <span className="text-lg font-semibold text-gray-800">
                      {item.expenseName}
                    </span>
                    <span className="text-sm  text-gray-800">
                      <span className="font-bold">Expense Amount : </span>{" "}
                      {item.amount} -/
                    </span>
                  </div>

                  {/* Right: Action Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      className="flex items-center gap-1 px-2 py-1 text-sm font-medium text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition"
                      onClick={() => fetchData(item.expenseID)}
                    >
                      <Pencil />
                    </button>

                    <button
                      onClick={() => {
                        setDelete(true);
                        setID(item.expenseID);
                      }}
                      className="flex items-center gap-1 px-2 py-1 text-sm font-medium text-red-600 border border-red-600 rounded hover:bg-red-50 transition"
                    >
                      <Trash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <span>No Record Found</span>
          )}
        </>
      )}
    </>
  );
}
