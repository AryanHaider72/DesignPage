"use client";
import DeleteUnitApi from "@/api/lib/Admin/Codes/Unit/DeleteUnit/DeleteUnit";
import GetUnitApi from "@/api/lib/Admin/Codes/Unit/GetUnit/GetUnit";
import GetInitalStoreSalesMan from "@/api/lib/Admin/Stores/GetInitalStore/GetInitalStore";
import {
  ResponseUnitAddData,
  UnitApiResponse,
  UnitList,
} from "@/api/types/Admin/Codes/Unit/Unit";
import {
  ResponseStoreList,
  storeListInital,
} from "@/api/types/Admin/Store/Store";
import DeleteComponent from "@/app/UsefullComponent/DeleteComponent/page";
import Spinner from "@/app/UsefullComponent/Spinner/page";
import { Pencil, Trash } from "lucide-react";
import { useEffect, useState } from "react";

interface AddExpenseProps {
  onEdit: (Datalist: UnitList, StoreID: string) => void;
  onShowMessage: (message: any, type: "success" | "error") => void;
}
export default function GetFormUnit({
  onEdit,
  onShowMessage,
}: AddExpenseProps) {
  const [UnitList, setUnitList] = useState<UnitList[]>([]);
  const [loading, setLoading] = useState(false);
  const [ID, setID] = useState("");
  const [StoreID, setStoreID] = useState("");
  const [Delete, setDelete] = useState(false);

  const [storeList, setStoreList] = useState<storeListInital[]>([]);

  const getStores = async () => {
    const token = localStorage.getItem("adminToken");
    const response = await GetInitalStoreSalesMan(String(token));
    const data = response.data as ResponseStoreList;
    if (data.storeList.length > 0) {
      setStoreList(data.storeList);
      setStoreID(data.storeList[0].storeID);
      UnitGet(data.storeList[0].storeID);
    } else {
      setStoreList([]);
    }
  };
  const UnitGet = async (ID: string) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("posSellerToken");
      const response = await GetUnitApi(String(token), ID);
      if (response.status === 200 || response.status === 201) {
        const data = response.data as UnitApiResponse;
        setUnitList(data.categoryList);
      } else {
        setUnitList([]);
      }
    } catch (err) {
      // setResponseBack(3);
    } finally {
      setLoading(false);
    }
  };
  const UnitDelete = async (ID: string) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("posSellerToken");
      const response = await DeleteUnitApi(
        { unitID: ID, storeID: StoreID },
        String(token),
      );
      if (response.status === 200 || response.status === 201) {
        const data = UnitList.filter((item) => item.unitID !== ID);
        setUnitList(data);
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
    const data = UnitList.find((item) => item.unitID === ID);
    if (data) {
      const formData = {
        unitID: data.unitID,
        unitName: data.unitName,
        abbreviation: data.abbreviation,
        description: data.description,
      };
      onEdit(formData, StoreID);
    }
  };
  useEffect(() => {
    getStores();
  }, []);
  return (
    <>
      {Delete && (
        <DeleteComponent
          onCancel={() => {
            setDelete(false);
            setID("");
          }}
          onConfirm={() => UnitDelete(ID)}
        />
      )}
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">
          Stores
        </label>
        <select
          value={StoreID}
          onChange={(e) => {
            setStoreID(e.target.value);
            UnitGet(e.target.value);
          }}
          className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none transition"
        >
          {storeList.length === 0 ? (
            <option> No Stores Found</option>
          ) : (
            <>
              <option>Select Store</option>
              {storeList.map((item) => (
                <option key={item.storeID} value={item.storeID}>
                  {item.storeName}
                </option>
              ))}
            </>
          )}
        </select>
      </div>
      <div className="mt-2 ">
        {loading ? (
          <div className="flex justify-center py-10">
            <Spinner />
          </div>
        ) : (
          <>
            {UnitList.length > 0 ? (
              <div className="space-y-4">
                {UnitList.map((item) => (
                  <div
                    key={item.unitID}
                    className="flex items-center justify-between bg-white shadow-md rounded-lg p-4 hover:shadow-xl transition relative"
                  >
                    {/* Left: Till Info */}
                    <div className="flex flex-col">
                      <span className="text-lg font-semibold text-gray-800">
                        {item.unitName}
                      </span>
                      <span className="text-sm mt-1  text-gray-800">
                        <span className="font-bold">Abbreviation : </span>{" "}
                        {item.abbreviation}
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
                        onClick={() => fetchData(item.unitID)}
                      >
                        <Pencil />
                      </button>

                      <button
                        onClick={() => {
                          setDelete(true);
                          setID(item.unitID);
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
