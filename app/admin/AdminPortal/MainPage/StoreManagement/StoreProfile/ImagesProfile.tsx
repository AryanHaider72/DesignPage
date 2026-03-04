"use client";
import StoreHomePageSettingDelete from "@/api/lib/Admin/Stores/DeleteStoreHomepAgeSetting/DeleteStoreHomePageSetting";
import GetInitalStoreSalesMan from "@/api/lib/Admin/Stores/GetInitalStore/GetInitalStore";
import StoreHomePageGetSetting from "@/api/lib/Admin/Stores/GetStoreHomePageSetting/GetStoreHomePageSetting";
import {
  ResponseStoreList,
  storeListInital,
} from "@/api/types/Admin/Store/Store";
import {
  StoreHomeGet,
  StoreHomeSettingGetApiResponse,
} from "@/api/types/Admin/Store/StoreHomepageSetting/StoreHomepageSetting";
import DeleteComponent from "@/app/UsefullComponent/DeleteComponent/page";
import Spinner from "@/app/UsefullComponent/Spinner/page";
import { Ellipsis, Trash } from "lucide-react";
import { useEffect, useRef, useState } from "react";
type ImageItem = {
  file: File;
  url: string;
};
type List = {
  imageUrl: string;
};

export default function ImagesProfile() {
  const [StoreID, setStoreID] = useState("");
  const [ID, setID] = useState("");
  const [Delete, setDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [DefaultStoreProductList, setDefaultStoreProductList] = useState<
    StoreHomeGet[]
  >([]);
  const [storeList, setStoreList] = useState<storeListInital[]>([]);

  const getStores = async () => {
    const token = localStorage.getItem("adminToken");
    const response = await GetInitalStoreSalesMan(String(token));
    const data = response.data as ResponseStoreList;

    if (data.storeList.length > 0) {
      setStoreID(data.storeList[0].storeID);
      HandleDefaultStoreGet(data.storeList[0].storeID);
      setStoreList(data.storeList);
    } else {
      setStoreList([]);
    }
  };
  const HandleDefaultStoreGet = async (ID: string) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      const response = await StoreHomePageGetSetting(ID, String(token));
      if (response.status === 200 || response.status === 201) {
        const data = response.data as StoreHomeSettingGetApiResponse;
        setDefaultStoreProductList(data.storeList);
      }
    } finally {
      setLoading(false);
    }
  };
  const deleteStoreSetting = async (ID: string) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await StoreHomePageSettingDelete(ID, String(token));
      if (response.status === 200 || response.status === 201) {
        setDefaultStoreProductList(
          DefaultStoreProductList.filter((item) => item.userID !== ID),
        );
      }
    } finally {
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
          onConfirm={() => deleteStoreSetting(ID)}
        />
      )}
      {loading ? (
        <div className="flex justify-center py-10">
          <Spinner />
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">
              Store
            </label>
            <div className="relative">
              <select
                value={StoreID}
                onChange={(e) => {
                  setStoreID(e.target.value);
                }}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition appearance-none cursor-pointer"
              >
                <option>Select Store</option>
                {storeList.map((cat) => (
                  <option key={cat.storeID} value={cat.storeID}>
                    {cat.storeName}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {DefaultStoreProductList.length > 0 ? (
            <>
              {DefaultStoreProductList.map((item) => (
                <div
                  key={item.userID}
                  className={`flex items-center justify-between bg-white border border-gray-100  shadow-md rounded-lg p-4 hover:shadow-xl transition relative`}
                >
                  <div>
                    <img src={item.logoUrl} className="w-20 h-10" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg font-semibold text-gray-800">
                      {item.headerText}
                    </span>
                    <span className="text-md  text-gray-800">
                      {item.subHeadingText
                        ? item.subHeadingText
                            .split(" ")
                            .slice(0, 10)
                            .join(" ") +
                          (item.subHeadingText.split(" ").length > 10
                            ? "..."
                            : "")
                        : "No subHeadingText"}
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
                      //   onClick={() => {
                      //     setStoresDefault(item.storeID);
                      //   }}
                      title="Default Store"
                      className="flex items-center gap-1 px-2 py-1 text-sm font-medium text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition"
                    >
                      {<Ellipsis />}
                    </button>
                    <button
                      onClick={() => {
                        setDelete(true);
                        setID(item.userID);
                      }}
                      title="Delete Store"
                      className="flex items-center gap-1 px-2 py-1 text-sm font-medium text-red-600 border border-red-600 rounded hover:bg-red-50 transition"
                    >
                      <Trash />
                    </button>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <p>No Record Found</p>
          )}
        </div>
      )}
    </>
  );
}
