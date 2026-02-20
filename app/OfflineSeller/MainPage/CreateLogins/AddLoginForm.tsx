"use client";
import GetInitalStoreSalesMan from "@/api/lib/Admin/Stores/GetInitalStore/GetInitalStore";
import GetTillForPos from "@/api/lib/Admin/TillRegister/TillGet/TillGet";
import AddLoginForPos from "@/api/lib/OfflineSeller/MainPage/CreateLogins/CreateLogin";
import {
  ResponseStoreList,
  storeListInital,
} from "@/api/types/Admin/Store/Store";
import {
  RespiosneGet,
  TillList,
} from "@/api/types/Admin/TillRegister/TillRegister";
import { Plus, Trash } from "lucide-react";
import { useEffect, useState } from "react";
interface AddTillFormProps {
  // Update: boolean;
  // TillID: string;
  onShowMessage: (message: string, type: "success" | "error") => void;
  //initialData?: TillList | null;
}
export default function AddLoginsOffline({
  onShowMessage,
  // Update,
  // initialData,
  // TillID,
}: AddTillFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [TillID, setTillID] = useState("");
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");

  const [TillList, setTillList] = useState<TillList[]>([]);

  const getTill = async () => {
    const token = localStorage.getItem("adminToken");
    const response = await GetTillForPos(String(token));
    if (response.status === 200) {
      const data = response.data as RespiosneGet;
      if (data) {
        console.log(data);
        setTillList(data.tillList);
      } else {
        setTillList([]);
      }
    }
  };

  const CreateLogin = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("sellerToken");
      const formData = {
        email: Email,
        password: Password,
        tillID: TillID,
      };
      const response = await AddLoginForPos(formData, String(token));
      if (response.status === 200) {
        onShowMessage(
          response.message || "Login Created successfully",
          "success",
        );
        setEmail("");
        setPassword("");
        setTillID("");
        // setIsTrue(false);
        // setResponseBack("Record Added Successfully");
      } else {
        onShowMessage(response.message || "Something went wrong", "error");
      }
    } catch (err) {
      onShowMessage("Network error. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getTill();
  }, []);

  return (
    <>
      <div className="w-full flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:max-w-md space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Till
            </label>
            <select
              value={TillID}
              onChange={(e) => {
                setTillID(e.target.value);
              }}
              className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none transition"
            >
              {TillList.length === 0 ? (
                <option> No Till Found</option>
              ) : (
                <>
                  <option>Select Store</option>
                  {TillList.map((item) => (
                    <option key={item.tillID} value={item.tillID}>
                      {item.tillName}
                    </option>
                  ))}
                </>
              )}
            </select>
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
              onClick={CreateLogin}
              className="px-6 py-2 rounded-xl bg-neutral-900 text-white font-medium hover:bg-neutral-800 transition shadow-lg"
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
        {/* <div className="w-full overflow-x-auto">
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
        </div> */}
      </div>
    </>
  );
}
