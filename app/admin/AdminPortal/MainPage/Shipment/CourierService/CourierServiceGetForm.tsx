"use client";
import DeleteCouriereApi from "@/api/lib/Admin/Shipment/Courier/DeleteCourier/DeleteCourier";
import GetCouriereApi from "@/api/lib/Admin/Shipment/Courier/GetCourier/GetCourier";
import {
  CourierList,
  ResponseCouriereGetData,
} from "@/api/types/Admin/Shipment/Couriere/Couriere";
import DeleteComponent from "@/app/UsefullComponent/DeleteComponent/page";
import Spinner from "@/app/UsefullComponent/Spinner/page";
import { Pencil, Trash } from "lucide-react";
import { useEffect, useState } from "react";

interface GetTillFormProps {
  initialData: (till: CourierList) => void;
  onShowMessage: (message: any, type: "success" | "error") => void;
}
export default function CourierServiceGetForm({
  initialData,
  onShowMessage,
}: GetTillFormProps) {
  const [loading, setLoading] = useState(false);
  const [ID, setID] = useState("");
  const [Delete, setDelete] = useState(false);
  const [courierData, setCourierData] = useState<CourierList[]>([]);

  const getDelieveryStandard = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      const response = await GetCouriereApi(String(token));
      const data = response.data as ResponseCouriereGetData;
      setCourierData(data.courierList);
    } finally {
      setLoading(false);
    }
  };
  const fetchData = (ID: string) => {
    const data = courierData.find((item) => item.courierID === ID);
    if (data) {
      initialData(data);
    }
  };
  const SubCategoryDelete = async (ID: string) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      const response = await DeleteCouriereApi(String(token), ID);
      if (response.status === 200 || response.status === 201) {
        const data = courierData.filter((item) => item.courierID !== ID);
        setCourierData(data);
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
            {courierData.length > 0 ? (
              <div className="space-y-4">
                {courierData.map((item) => (
                  <div
                    key={item.courierID}
                    className="flex items-center justify-between bg-white shadow-md rounded-lg p-4 hover:shadow-xl transition relative"
                  >
                    {/* Left: Till Info */}
                    <div className="flex flex-col">
                      <span className="text-lg font-semibold text-gray-800">
                        {item.serviceName}
                      </span>
                      <span className="text-sm mt-1  text-gray-800">
                        <span className="font-bold">Delivery : </span>{" "}
                        {item.typeName}{" "}
                      </span>
                      <div className="flex gap-5">
                        <span className="text-sm mt-1  text-gray-800">
                          <span className="font-bold">Email : </span>{" "}
                          {item.email}{" "}
                        </span>
                        <span className="text-sm mt-1  text-gray-800">
                          <span className="font-bold">Phone No : </span>{" "}
                          {item.phoneNo}{" "}
                        </span>
                      </div>

                      <span className="text-sm mt-1  text-gray-800">
                        <span className="font-bold">Description : </span>{" "}
                        {item.description}{" "}
                      </span>
                    </div>

                    {/* Right: Action Buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        className="flex items-center gap-1 px-2 py-1 text-sm font-medium text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition"
                        onClick={() => fetchData(item.courierID)}
                      >
                        <Pencil />
                      </button>

                      <button
                        onClick={() => {
                          setDelete(true);
                          setID(item.courierID);
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
