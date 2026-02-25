"use client";
import DeleteSupplierApi from "@/api/lib/Admin/Codes/Supplier/DeleteSupplier/DeleteSupplier";
import GetSupplierApi from "@/api/lib/Admin/Codes/Supplier/GetSupplier/GetSupplier";
import {
  ResponseSupplierGetData,
  SupplierData,
} from "@/api/types/Admin/Codes/Supplier/Supplier";
import DeleteComponent from "@/app/UsefullComponent/DeleteComponent/page";
import Spinner from "@/app/UsefullComponent/Spinner/page";
import { Pencil, Trash } from "lucide-react";
import { useEffect, useState } from "react";

interface AddExpenseProps {
  onEdit: (Datalist: SupplierData) => void;
  onShowMessage: (message: any, type: "success" | "error") => void;
}
export default function GetSupplierForm({
  onEdit,
  onShowMessage,
}: AddExpenseProps) {
  const [SupplierList, setSupplierList] = useState<SupplierData[]>([]);
  const [loading, setLoading] = useState(false);
  const [ID, setID] = useState("");
  const [Delete, setDelete] = useState(false);

  const SupplierGet = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("posSellerToken");
      const response = await GetSupplierApi(String(token));
      if (response.status === 200 || response.status === 201) {
        const data = response.data as ResponseSupplierGetData;
        setSupplierList(data.supplierList);
      } else {
        setSupplierList([]);
      }
    } catch (err) {
      // setResponseBack(3);
    } finally {
      setLoading(false);
    }
  };
  const SupplierDelete = async (ID: string) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("posSellerToken");
      const response = await DeleteSupplierApi(
        { supplierID: ID },
        String(token),
      );
      if (response.status === 200 || response.status === 201) {
        const data = SupplierList.filter((item) => item.supplierID !== ID);
        setSupplierList(data);
        setDelete(false);
      } else {
        setDelete(false);
        onShowMessage(
          response.message || "An Error Occurred while Deleting.",
          "error",
        );
      }
    } catch (err) {
      // setResponseBack(3);
    } finally {
      setLoading(false);
    }
  };
  const fetchData = (ID: string) => {
    const data = SupplierList.find((item) => item.supplierID === ID);
    if (data) {
      const formData = {
        supplierID: data.supplierID,
        supplierName: data.supplierName,
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
    SupplierGet();
  }, []);

  return (
    <>
      {Delete && (
        <DeleteComponent
          onCancel={() => {
            setDelete(false);
            setID("");
          }}
          onConfirm={() => SupplierDelete(ID)}
        />
      )}
      {loading ? (
        <div className="flex justify-center py-10">
          <Spinner />
        </div>
      ) : (
        <>
          {SupplierList.length > 0 ? (
            <div className="space-y-4">
              {SupplierList.map((item) => (
                <div
                  key={item.supplierID}
                  className="flex items-center justify-between bg-white shadow-md rounded-lg p-4 hover:shadow-xl transition relative"
                >
                  {/* Left: Till Info */}
                  <div className="flex flex-col">
                    <span className="text-lg font-semibold text-gray-800">
                      {item.supplierName}
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
                      onClick={() => fetchData(item.supplierID)}
                    >
                      <Pencil />
                    </button>

                    <button
                      onClick={() => {
                        setDelete(true);
                        setID(item.supplierID);
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
