"use client";

import GetINternationShippingCharges from "@/api/lib/Admin/Shipment/Internation/GetInternation/GetInternation";
import {
  loopList,
  responseINternationShippingRateCountry,
  shippingDetail,
} from "@/api/types/Admin/Shipment/International/Internation";
import Spinner from "@/app/UsefullComponent/Spinner/page";
import { useEffect, useState } from "react";
type EditableField =
  | "lessThen1KG"
  | "lessThen5KG"
  | "lessThen10KG"
  | "greaterThen10KG";

export default function InternationDelievryAddForm() {
  const [loading, setLoading] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [internationData, setInternationData] = useState<loopList[]>([]);
  const [CombinationList, setCombinationList] = useState<shippingDetail[]>([]);

  const callData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("sellerToken");
      const response = await GetINternationShippingCharges(String(token));
      if (response.status === 200 || response.status === 201) {
        const data = response.data as responseINternationShippingRateCountry;
        console.log(response.data);
        setInternationData(data.loopList);
      }
    } finally {
      setLoading(false);
    }
  };
  const handleChange = (index: number, field: EditableField, value: string) => {
    setCombinationList((prev) => {
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
                        {item.countryFrom}
                      </td>

                      <td className="px-4 py-3 font-medium">
                        {item.countryTo}
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
          </>
        )}
      </div>
    </>
  );
}
