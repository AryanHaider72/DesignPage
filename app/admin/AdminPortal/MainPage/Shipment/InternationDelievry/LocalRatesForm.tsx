"use client";
import AddLocalShippingCharges from "@/api/lib/Admin/Shipment/LocalRates/LocalRatesAdd/LocalRatesAdd";
import GetLocalShippingCharges from "@/api/lib/Admin/Shipment/LocalRates/LocalRatesGet/LocalRates";
import {
  loopListZone,
  responseINternationShippingRateZone,
  shippingDetailZone,
} from "@/api/types/Admin/Shipment/local/local";

import Spinner from "@/app/UsefullComponent/Spinner/page";
import { useEffect, useState } from "react";
type EditableField =
  | "lessThen1KG"
  | "lessThen5KG"
  | "lessThen10KG"
  | "greaterThen10KG";
interface AddExpenseProps {
  onShowMessage: (message: any, type: "success" | "error") => void;
}
export default function LocalRatesForm({ onShowMessage }: AddExpenseProps) {
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [internationData, setInternationData] = useState<loopListZone[]>([]);
  const [CombinationList, setCombinationList] = useState<shippingDetailZone[]>(
    [],
  );
  const callData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      const response = await GetLocalShippingCharges(String(token));
      if (response.status === 200 || response.status === 201) {
        const data = response.data as responseINternationShippingRateZone;
        console.log(response.data);
        setInternationData(data.loopList);
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (internationData.length > 0) {
      const initialData: shippingDetailZone[] = internationData.map((item) => ({
        storeZoneID: item.fromZoneID,
        destinationZoneID: item.toZoneID,
        deliveryType: item.deliveryType,
        deliveryTypeID: item.deliveryTypeID,
        lessThen1KG: item.lessThen1KG,
        lessThen5KG: item.lessThen5KG,
        lessThen10KG: item.lessThen10KG,
        greaterThen10KG: item.greaterThen10KG,
      }));

      setCombinationList(initialData);
    }
  }, [internationData]);
  const addRates = async () => {
    try {
      setLoading2(true);
      const token = localStorage.getItem("adminToken");
      const formData = {
        shippingDetail: internationData.map((item) => ({
          deliveryTypeID: item.deliveryTypeID,
          lessThen1KG: item.lessThen1KG || 0,
          lessThen5KG: item.lessThen5KG || 0,
          lessThen10KG: item.lessThen10KG || 0,
          greaterThen10KG: item.greaterThen10KG || 0,
          storeZoneID: item.fromZoneID,
          destinationZoneID: item.toZoneID,
        })),
      };

      const response = await AddLocalShippingCharges(formData, String(token));
      if (response.status === 200 || response.status === 201) {
        onShowMessage(
          response.message || "Rates Modified successfully",
          "success",
        );
      }
    } catch (error) {
      onShowMessage("Something went wrong", "error");
      setLoading2(true);
    } finally {
      setLoading2(false);
    }
  };
  const handleChange = (index: number, field: EditableField, value: string) => {
    setInternationData((prev) => {
      const updated = [...prev];

      updated[index] = {
        ...updated[index],
        [field]: value === "" ? "" : Number(value),
      };

      return updated;
    });
  };
  useEffect(() => {
    callData();
  }, []);
  return (
    <>
      <div className="space-y-5 mt-2">
        {loading ? (
          <>
            <Spinner />
          </>
        ) : (
          <>
            <div className="w-full overflow-x-auto">
              <table className="min-w-[900px] w-full border border-gray-200 rounded-lg">
                <thead className="bg-gray-100">
                  <tr className="text-left text-sm font-semibold text-gray-700">
                    <th className="px-4 py-3">#</th>
                    <th className="px-4 py-3">Location 1</th>
                    <th className="px-4 py-3">Location 2</th>
                    <th className="px-4 py-3">Delievry </th>
                    <th className="px-4 py-3">
                      Rate{" "}
                      <span className="text-sm text-gray-400 font-bold">
                        {"<" + 1}
                      </span>
                    </th>
                    <th className="px-4 py-3">
                      Rate{" "}
                      <span className="text-sm text-gray-400 font-bold">
                        {"<" + 5}
                      </span>
                    </th>
                    <th className="px-4 py-3">
                      Rate{" "}
                      <span className="text-sm text-gray-400 font-bold">
                        {"<" + 10}
                      </span>
                    </th>
                    <th className="px-4 py-3">
                      Rate{" "}
                      <span className="text-sm text-gray-400 font-bold">
                        {">" + 10}
                      </span>
                    </th>
                  </tr>
                </thead>

                <tbody className="text-sm">
                  {internationData.map((item, index) => (
                    <tr
                      key={index + 1}
                      className="border-t hover:bg-gray-50 transition"
                    >
                      <td className="px-4 py-3">{index + 1}</td>

                      <td className="px-4 py-3 font-medium">
                        {item.fromZoneName}
                      </td>

                      <td className="px-4 py-3 font-medium">
                        {item.toZoneName}
                      </td>
                      <td className="px-4 py-3 font-medium">
                        {item.deliveryType}
                      </td>

                      <td className="px-4 py-3">
                        <input
                          value={CombinationList[index]?.lessThen1KG ?? 0}
                          onChange={(e) =>
                            handleChange(index, "lessThen1KG", e.target.value)
                          }
                          type="number"
                          placeholder="Min"
                          className="w-24 rounded-md border border-gray-300 px-2 py-1 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                      </td>

                      <td className="px-4 py-3">
                        <input
                          value={CombinationList[index]?.lessThen5KG ?? 0}
                          onChange={(e) =>
                            handleChange(index, "lessThen5KG", e.target.value)
                          }
                          type="number"
                          placeholder="Max"
                          className="w-24 rounded-md border border-gray-300 px-2 py-1 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          value={CombinationList[index]?.lessThen10KG ?? 0}
                          onChange={(e) =>
                            handleChange(index, "lessThen10KG", e.target.value)
                          }
                          type="number"
                          placeholder="Max"
                          className="w-24 rounded-md border border-gray-300 px-2 py-1 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                      </td>

                      <td className="px-4 py-3">
                        <input
                          value={CombinationList[index]?.greaterThen10KG ?? 0}
                          onChange={(e) =>
                            handleChange(
                              index,
                              "greaterThen10KG",
                              e.target.value,
                            )
                          }
                          type="number"
                          placeholder="Rate"
                          className="w-28 rounded-md border border-gray-300 px-2 py-1 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                      </td>

                      {/* <td className="px-4 py-3 text-center">
                                <button className="rounded-md bg-green-600 px-3 py-1.5 text-white text-xs hover:bg-green-700">
                                  Save
                                </button>
                              </td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end">
              <button
                onClick={addRates}
                className="px-6 py-2 rounded-xl bg-neutral-900 text-white font-medium hover:bg-neutral-800 transition shadow-lg"
              >
                {loading2 ? "Saving..." : "Save"}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
