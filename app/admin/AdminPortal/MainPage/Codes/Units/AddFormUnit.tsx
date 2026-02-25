import AddUnitApi from "@/api/lib/Admin/Codes/Unit/AddUnit/AddUnit";
import ModifyUnitApi from "@/api/lib/Admin/Codes/Unit/ModifyUnit/ModifyUnit";
import GetInitalStoreSalesMan from "@/api/lib/Admin/Stores/GetInitalStore/GetInitalStore";
import { UnitList } from "@/api/types/Admin/Codes/Unit/Unit";
import {
  ResponseStoreList,
  storeListInital,
} from "@/api/types/Admin/Store/Store";
import { useEffect, useState } from "react";

interface AddUnitProps {
  initialData?: UnitList | null;
  storeID: string;
  Update: boolean;
  onShowMessage: (message: any, type: "success" | "error") => void;
}
export default function AddFormUnit({
  initialData,
  storeID,
  Update,
  onShowMessage,
}: AddUnitProps) {
  const [loading, setLoading] = useState(false);
  const [ID, setID] = useState("");
  const [StoreID, setStoreID] = useState("");
  const [unitName, setUnitName] = useState("");
  const [storeList, setStoreList] = useState<storeListInital[]>([]);
  const [Abbreviation, setAbbreviation] = useState("");
  const [Description, setDescription] = useState("");

  const getStores = async () => {
    const token = localStorage.getItem("adminToken");
    const response = await GetInitalStoreSalesMan(String(token));
    const data = response.data as ResponseStoreList;
    if (data.storeList.length > 0) {
      setStoreList(data.storeList);
    } else {
      setStoreList([]);
    }
  };

  const AddUnitData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      const formData = {
        unitName: unitName,
        storeID: StoreID,
        abbreviation: Abbreviation,
        description: Description,
      };
      const response = await AddUnitApi(formData, String(token));
      if (response.status === 200) {
        setUnitName("");
        setAbbreviation("");
        setDescription("");
        onShowMessage(response.message || "Unit Added successfully", "success");
      } else {
        onShowMessage(response.message, "error");
      }
    } finally {
      setLoading(false);
    }
  };
  const ModifyUnitData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      const formData = {
        unitID: ID,
        unitName: unitName,
        storeID: StoreID,
        abbreviation: Abbreviation,
        description: Description,
      };
      const response = await ModifyUnitApi(formData, String(token));
      if (response.status === 200) {
        setID("");
        setUnitName("");
        setAbbreviation("");
        setDescription("");
        onShowMessage(
          response.message || "Unit Modified successfully",
          "success",
        );
      } else {
        onShowMessage(response.message, "error");
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (initialData) {
      setStoreID(storeID);
      setUnitName(initialData.unitName);
      setDescription(initialData.description);
      setAbbreviation(initialData.abbreviation);
      setID(initialData.unitID);
    }
  }, [initialData]);
  useEffect(() => {
    getStores();
  }, []);
  return (
    <>
      <div className="w-full flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:max-w-md space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Stores
            </label>
            <select
              value={StoreID}
              onChange={(e) => {
                setStoreID(e.target.value);
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
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Unit Name
            </label>
            <input
              type="text"
              value={unitName}
              onChange={(e) => setUnitName(e.target.value)}
              placeholder="Enter Unit Name"
              className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Abbreviation
            </label>
            <input
              type="text"
              value={Abbreviation}
              onChange={(e) => setAbbreviation(e.target.value)}
              placeholder="Enter Abbreviation"
              className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Description
            </label>
            <textarea
              value={Description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter Description"
              className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none transition"
            />
          </div>
          {Update ? (
            <div className="flex justify-end">
              <button
                onClick={ModifyUnitData}
                className="px-6 py-2 rounded-xl bg-neutral-900 text-white font-medium hover:bg-neutral-800 transition shadow-lg"
              >
                {loading ? "Updating..." : "Update"}
              </button>
            </div>
          ) : (
            <div className="flex justify-end">
              <button
                onClick={AddUnitData}
                className="px-6 py-2 rounded-xl bg-neutral-900 text-white font-medium hover:bg-neutral-800 transition shadow-lg"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
