"use client";
import DeleteCustomer from "@/api/lib/PosIntegration/Customer/DeleteCustomer/DeleteCustomer";
import GetCustomer from "@/api/lib/PosIntegration/Customer/GetCustomer/GetCustomer";
import {
  CustomerData,
  ResponseCustomerGetData,
} from "@/api/types/Posintegration/Customer";
import DeleteComponent from "@/app/UsefullComponent/DeleteComponent/page";
import Spinner from "@/app/UsefullComponent/Spinner/page";
import { Pencil, Trash } from "lucide-react";
import { useEffect, useState } from "react";

interface AddExpenseProps {
  onEdit: (Datalist: CustomerData) => void;
  onShowMessage: (message: any, type: "success" | "error") => void;
}
export default function GetCustomerData({
  onShowMessage,
  onEdit,
}: AddExpenseProps) {
  const [ID, setID] = useState("");
  const [Delete, setDelete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [customerList, setCustomerList] = useState<CustomerData[]>([]);

  const CustomerGet = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("posSellerToken");
      const response = await GetCustomer(String(token));
      if (response.status === 200 || response.status === 201) {
        const data = response.data as ResponseCustomerGetData;
        setCustomerList(data.customerList);
      } else {
        setCustomerList([]);
      }
    } catch (err) {
      // setResponseBack(3);
    } finally {
      setIsLoading(false);
    }
  };

  const CustomerDelete = async (ID: string) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("posSellerToken");
      const formdata = {
        customerID: ID,
      };
      const response = await DeleteCustomer(formdata, String(token));
      if (response.status === 200 || response.status === 201) {
        setCustomerList((item) => item.filter((emp) => emp.customerID !== ID));
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
    const data = customerList.find((item) => item.customerID === ID);
    if (data) {
      const formData = {
        customerID: data.customerID,
        customerName: data.customerName,
        remainingBalance: data.remainingBalance,
        address: data.address,
        phoneNo: data.phoneNo,
        email: data.email,
        description: data.description,
      };
      onEdit(formData);
    }
  };

  useEffect(() => {
    CustomerGet();
  }, []);
  return (
    <>
      {Delete && (
        <DeleteComponent
          onCancel={() => {
            setDelete(false);
            setID("");
          }}
          onConfirm={() => CustomerDelete(ID)}
        />
      )}

      {isLoading ? (
        <div className="flex justify-center py-10">
          <Spinner />
        </div>
      ) : (
        <>
          {customerList.length > 0 ? (
            <div className="space-y-4">
              {customerList.map((item) => (
                <div
                  key={item.customerID}
                  className="flex items-center justify-between bg-white shadow-md rounded-lg p-4 hover:shadow-xl transition relative"
                >
                  {/* Left: Till Info */}
                  <div className="flex flex-col">
                    <span className="text-lg font-semibold text-gray-800">
                      {item.customerName}
                    </span>
                    <span className="text-sm mt-1  text-gray-800">
                      <span className="font-bold">Phone No : </span>{" "}
                      {item.phoneNo}
                    </span>
                    <span className="text-sm mt-1  text-gray-800">
                      <span className="font-bold">Email : </span>{" "}
                      {item.email}{" "}
                    </span>
                  </div>

                  {/* Right: Action Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      className="flex items-center gap-1 px-2 py-1 text-sm font-medium text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition"
                      onClick={() => fetchData(item.customerID)}
                    >
                      <Pencil />
                    </button>

                    <button
                      onClick={() => {
                        setDelete(true);
                        setID(item.customerID);
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
