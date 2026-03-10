"use client";
import CreateLoginsApi from "@/api/lib/Admin/CreateLogins/CcreateLogin/CreateLogin";
import GetInitalStoreSalesMan from "@/api/lib/Admin/Stores/GetInitalStore/GetInitalStore";
import {
  ResponseStoreList,
  storeListInital,
} from "@/api/types/Admin/Store/Store";
import { Plus, Trash } from "lucide-react";
import { useEffect, useState } from "react";

interface itemsList {
  storeID: string;
  storeName: string;
}
interface AddUnitProps {
  // initialData?: CategorySub | null;
  // storeID: string;
  // Update: boolean;
  onShowMessage: (message: any, type: "success" | "error") => void;
}
export default function AddLoginsOnline({ onShowMessage }: AddUnitProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [storeID, setStoreID] = useState("");
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [storeList, setStoreList] = useState<storeListInital[]>([]);
  const [items, setItems] = useState<itemsList[]>([]);

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

  useEffect(() => {
    getStores();
  }, []);

  const handleAddItem = () => {
    const stores = storeList.find((item) => item.storeID === storeID);
    if (!stores) return alert("store not found");

    const existingRecord = items.find((i) => i.storeID === storeID);
    if (existingRecord) return alert("Record Already Exist");

    const newEntry: itemsList = {
      storeID: stores.storeID,
      storeName: stores.storeName,
    };
    setItems((prev) => [...prev, newEntry]);
    setStoreID("");
  };

  const handleRemoveItem = (index: string) => {
    const data = items.filter((item) => item.storeID !== index);
    setItems(data);
  };
  const handleSaveCreateLogin = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("adminToken");
      const formData = {
        userName: "",
        email: Email,
        password: Password,
        phoneNo: "",
        status: "OnlineSeller",
        stores: items.map((list) => ({
          storeID: list.storeID,
        })),
        address: "",
      };
      const response = await CreateLoginsApi(formData, String(token));
      if (response.status === 200 || response.status === 201) {
        setItems([]);
        setEmail("");
        setPassword("");
        onShowMessage(
          response.message || "Login Created successfully",
          "success",
        );
      } else {
        onShowMessage(response.message, "error");
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <div className="w-full flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:max-w-md space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Stores
            </label>
            <div className="flex gap-1 ">
              <select
                value={storeID}
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
              <button
                onClick={() => handleAddItem()}
                className="px-2 py-2 text-white rounded-md shadow-md bg-yellow-500 hover:bg-yellow-600"
              >
                <Plus />
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Email
            </label>
            <input
              type="text"
              value={Email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none transition"
              placeholder="Email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Password
            </label>
            <input
              type="text"
              value={Password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none transition"
              placeholder="Password"
            />
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleSaveCreateLogin}
              className="px-6 py-2 rounded-xl bg-neutral-900 text-white font-medium hover:bg-neutral-800 transition shadow-lg"
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="py-3 px-4 text-sm text-neutral-500">#</th>
                <th className="py-3 px-4 text-sm text-neutral-500">
                  Store Name
                </th>
                <th className="py-3 px-4 text-sm text-neutral-500">Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-neutral-100 hover:bg-neutral-100/50 transition"
                >
                  <td className="py-3 px-4">{index + 1}</td>

                  <td className="py-3 px-4">{item.storeName}</td>

                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleRemoveItem(item.storeID)}
                      className="px-2 py-2 text-white rounded-md shadow-md cursor-pointer bg-red-500 hover:bg-red-600"
                    >
                      <Trash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
