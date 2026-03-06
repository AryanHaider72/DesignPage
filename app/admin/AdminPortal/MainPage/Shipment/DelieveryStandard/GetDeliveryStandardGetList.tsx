"use client";
import DeleteDelieveryStandardApi from "@/api/lib/Admin/Shipment/Delievry/DeleteDelieveryStandard/DeleteDelieveryStandard";
import GetDelieveryStandardApi from "@/api/lib/Admin/Shipment/Delievry/GetDelievryStandard/GetDelievryStandard";
import {
  DelievryGetData,
  ResponseDelievryGetData,
} from "@/api/types/Admin/Shipment/Delievry/Delievry";
import DeleteComponent from "@/app/UsefullComponent/DeleteComponent/page";
import Spinner from "@/app/UsefullComponent/Spinner/page";
import { Pencil, Trash } from "lucide-react";
import { useEffect, useState } from "react";
interface AddExpenseProps {
  onEdit: (Datalist: DelievryGetData) => void;
  onShowMessage: (message: any, type: "success" | "error") => void;
}
export default function GetDeliveryStandardGetList({
  onEdit,
  onShowMessage,
}: AddExpenseProps) {
  const [ID, setID] = useState("");
  const [Delete, setDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [delieveryGet, setDelieveryGet] = useState<DelievryGetData[]>([]);

  const getDelieveryStandard = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("sellerToken");
      const response = await GetDelieveryStandardApi(String(token));
      const data = response.data as ResponseDelievryGetData;
      console.log(response);
      setDelieveryGet(data.delievryData);
    } finally {
      setLoading(false);
    }
  };
  const fetchData = (ID: string) => {
    const data = delieveryGet.find((item) => item.deliveryTypeID === ID);
    if (data) {
      onEdit(data);
    }
  };
  const SubCategoryDelete = async (ID: string) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("sellerToken");
      const response = await DeleteDelieveryStandardApi(ID, String(token));
      if (response.status === 200 || response.status === 201) {
        const data = delieveryGet.filter((item) => item.deliveryTypeID !== ID);
        setDelieveryGet(data);
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
  useEffect(() => {
    getDelieveryStandard();
  }, []);
  return (
    <>
      {Delete && (
        <DeleteComponent
          onCancel={() => {
            setDelete(false);
            setID("");
          }}
          onConfirm={() => SubCategoryDelete(ID)}
        />
      )}
      <div className="mt-2 ">
        {loading ? (
          <div className="flex justify-center py-10">
            <Spinner />
          </div>
        ) : (
          <>
            {delieveryGet.length > 0 ? (
              <div className="space-y-4">
                {delieveryGet.map((item) => (
                  <div
                    key={item.deliveryTypeID}
                    className="flex items-center justify-between bg-white shadow-md rounded-lg p-4 hover:shadow-xl transition relative"
                  >
                    {/* Left: Till Info */}
                    <div className="flex flex-col">
                      <span className="text-lg font-semibold text-gray-800">
                        {item.typeName}
                      </span>
                      <span className="text-sm mt-1  text-gray-800">
                        <span className="font-bold">Number of Days : </span>{" "}
                        {item.numberofDays}{" "}
                      </span>

                      <span className="text-sm mt-1  text-gray-800">
                        <span className="font-bold">Description : </span>{" "}
                        {item.description}{" "}
                      </span>
                    </div>

                    {/* Right: Action Buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        className="flex items-center gap-1 px-2 py-1 text-sm font-medium text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition"
                        onClick={() => fetchData(item.deliveryTypeID)}
                      >
                        <Pencil />
                      </button>

                      <button
                        onClick={() => {
                          setDelete(true);
                          setID(item.deliveryTypeID);
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
      </div>
    </>
  );
}
