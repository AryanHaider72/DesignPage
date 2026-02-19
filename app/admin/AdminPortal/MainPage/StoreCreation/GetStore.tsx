import StoreDefaultSet from "@/api/lib/Admin/Stores/DefaultStore/DefaultStore";
import StoreDelete from "@/api/lib/Admin/Stores/DeleteStore/DeleteStore";
import GetInitalStoreSalesMan from "@/api/lib/Admin/Stores/GetInitalStore/GetInitalStore";
import {
  ResponseStoreList,
  storeListInital,
} from "@/api/types/Admin/Store/Store";
import Spinner from "@/app/UsefullComponent/Spinner/page";
import { Check, DotSquare, Ellipsis, Pencil, Trash } from "lucide-react";
import { useEffect, useState } from "react";

export default function StoreGetPage() {
  const [loading, setLoading] = useState(true);
  const [isloading, setIsLoading] = useState(false);
  const [storeList, setStoreList] = useState<storeListInital[]>([]);

  const getStores = async () => {
    try {
      true;
      const token = localStorage.getItem("adminToken");
      const response = await GetInitalStoreSalesMan(String(token));
      const data = response.data as ResponseStoreList;
      if (data.storeList.length > 0) {
        setStoreList(data.storeList);
      } else {
        setStoreList([]);
      }
    } finally {
      setLoading(false);
    }
  };
  const setStoresDefault = async (ID: string) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("adminToken");
      const response = await StoreDefaultSet(ID, String(token));
      if (response.status === 200) {
        getStores();
      }
    } finally {
      setIsLoading(false);
    }
  };
  const DeleteStore = async (ID: string) => {
    const token = localStorage.getItem("adminToken");
    const response = await StoreDelete(ID, String(token));
    const data = storeList.filter((item) => item.storeID !== ID);
    if (data) {
      setStoreList(data);
    }
  };

  useEffect(() => {
    getStores();
  }, []);
  return (
    <>
      {loading ? (
        <div className="flex justify-center py-10">
          <Spinner />
        </div>
      ) : (
        <div className="space-y-4">
          {storeList.map((item) => (
            <div
              key={item.storeID}
              className={`flex items-center justify-between ${item.defaultStore ? `bg-blue-50 border border-blue-400` : `bg-white border border-gray-100`}  shadow-md rounded-lg p-4 hover:shadow-xl transition relative`}
            >
              <div className="flex flex-col">
                <span className="text-lg font-semibold text-gray-800">
                  {item.storeName}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {/* <button
              className="flex items-center gap-1 px-2 py-1 text-sm font-medium text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition"
              //onClick={() => fetchData(item.tillID)}
            >
              <Pencil />
            </button> */}
                <button
                  onClick={() => {
                    setStoresDefault(item.storeID);
                  }}
                  title="Default Store"
                  className="flex items-center gap-1 px-2 py-1 text-sm font-medium text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition"
                >
                  {isloading ? <Ellipsis /> : <Check />}
                </button>
                <button
                  onClick={() => {
                    DeleteStore(item.storeID);
                  }}
                  title="Delete Store"
                  className="flex items-center gap-1 px-2 py-1 text-sm font-medium text-red-600 border border-red-600 rounded hover:bg-red-50 transition"
                >
                  <Trash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
