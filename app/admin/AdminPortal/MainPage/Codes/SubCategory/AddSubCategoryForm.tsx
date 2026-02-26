"use client";
import GetCategoryMainApi from "@/api/lib/Admin/Codes/Category/GetCategoryMain/GetCategoryMain";
import GetCategoruSubApi from "@/api/lib/Admin/Codes/Category/SubCategory/GetSubCategory/GetSubCategory";
import AddSubCategoryMoreApi from "@/api/lib/Admin/Codes/Category/SubCatgeroyMore/AddSubCategory/AddSubCategoryMore";
import ModifySubCategoryMoreApi from "@/api/lib/Admin/Codes/Category/SubCatgeroyMore/ModifySubCategoryMore/ModifySubCategoryMore";
import GetUnitApi from "@/api/lib/Admin/Codes/Unit/GetUnit/GetUnit";
import GetInitalStoreSalesMan from "@/api/lib/Admin/Stores/GetInitalStore/GetInitalStore";
import {
  CategoryMain,
  CategoryMainApiResponse,
} from "@/api/types/Admin/Codes/Category/MainCategory/MainCateogry";
import {
  CategorySub,
  CategorySubApiResponse,
} from "@/api/types/Admin/Codes/Category/SubCategory/SubCategory";
import { FurtherSub } from "@/api/types/Admin/Codes/Category/SubCategoryMore/SubCategoryMore";
import { UnitApiResponse, UnitList } from "@/api/types/Admin/Codes/Unit/Unit";
import {
  ResponseStoreList,
  storeListInital,
} from "@/api/types/Admin/Store/Store";
import { Plus, Trash } from "lucide-react";
import { useEffect, useState } from "react";

interface AddUnitProps {
  initialData?: FurtherSub | null;
  storeID: string;
  Update: boolean;
  onShowMessage: (message: any, type: "success" | "error") => void;
}
interface itemsList {
  storeID?: string;
  storeName?: string;
  categoryName?: string;
  categoryID?: string;
  unitName?: string;
  UnitID?: string;
  SubCategoryName?: string;
  FurtherSubCategoryName?: string;
  SubCategroyMainName?: string;
  SubCategoryMainID?: string;
}
export default function AddSubCategoryForm({
  initialData,
  storeID,
  Update,
  onShowMessage,
}: AddUnitProps) {
  const [loading, setLoading] = useState(false);
  const [StoreID, setStoreID] = useState("");
  const [StoreName, setStoreName] = useState("");
  const [catgeoryMainList, setCatgeoryMainList] = useState<CategoryMain[]>([]);
  const [storeList, setStoreList] = useState<storeListInital[]>([]);
  const [catgeorySubList, setCatgeorySubList] = useState<CategorySub[]>([]);
  const [UnitList, setUnitList] = useState<UnitList[]>([]);
  const [items, setItems] = useState<itemsList[]>([]);
  const isFurtherSubCategoryLocked = items.length > 0;
  const [CategoryMainID, setCategoryMainID] = useState("");
  const [SubCategoryMainID, setSubCategoryMainID] = useState("");
  const [CategoryMainName, setCategoryMainName] = useState("");
  const [SubCategoryMainName, setSubCategoryMainName] = useState("");
  const [UnitID, setUnitID] = useState("");
  const [DetailID, setDetailID] = useState("");
  const [FurtherSubCategory, setFurtherSubCategory] = useState("");

  const getCategroyMain = async (ID: string) => {
    const token = localStorage.getItem("adminToken");
    const response = await GetCategoryMainApi(String(token));

    if (response.status === 200 || response.status === 201) {
      const data = response.data as CategoryMainApiResponse;
      setCatgeoryMainList(data.categoryList);
      setCategoryMainID(data.categoryList[0].categoryID);
      setCategoryMainName(data.categoryList[0].categoryName);
      getSubCategroy(data.categoryList[0].categoryID, ID);
    }
  };

  const getStores = async () => {
    const token = localStorage.getItem("adminToken");
    const response = await GetInitalStoreSalesMan(String(token));
    const data = response.data as ResponseStoreList;
    if (data.storeList.length > 0) {
      setStoreList(data.storeList);
      if (storeID) {
        setStoreID(storeID);
        UnitGet(data.storeList[0].storeID);
      } else {
        getCategroyMain(data.storeList[0].storeID);
        setStoreID(data.storeList[0].storeID);
        UnitGet(data.storeList[0].storeID);
        setStoreName(data.storeList[0].storeName);
      }
    } else {
      setStoreList([]);
    }
  };

  const UnitGet = async (ID: string) => {
    const token = localStorage.getItem("adminToken");
    const response = await GetUnitApi(String(token), ID);
    if (response.status === 200 || response.status === 201) {
      const data = response.data as UnitApiResponse;
      setUnitList(data.categoryList);
    } else {
      setUnitList([]);
    }
  };
  const getSubCategroy = async (ID: string, storeID: string) => {
    const formData = {
      categoryID: ID,
      storeID: storeID,
    };
    const token = localStorage.getItem("adminToken");
    const response = await GetCategoruSubApi(String(token), formData);
    if (response.status === 200 || response.status === 201) {
      const data = response.data as CategorySubApiResponse;
      setCatgeorySubList(data.categoryList);
      setSubCategoryMainName(data.categoryList[0].subCategoryName);
      setSubCategoryMainID(data.categoryList[0].subCategoryID);
    } else {
      setCatgeorySubList([]);
    }
  };

  const AddFurtherCategoryData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      const formData = {
        subCategoryID: SubCategoryMainID,
        name: FurtherSubCategory,
        units: items.map((item) => ({
          unitID: item.UnitID || "",
        })),
      };
      const response = await AddSubCategoryMoreApi(formData, String(token));
      if (response.status === 200) {
        setItems([]);
        setFurtherSubCategory("");
        setUnitID("");
        onShowMessage(
          response.message || "Category Added successfully",
          "success",
        );
      } else {
        onShowMessage(response.message, "error");
      }
    } finally {
      setLoading(false);
    }
  };
  const HadnleSaveItem = () => {
    const data = UnitList.find((item) => item.unitID === UnitID);
    if (!data) return alert("Item not found");
    const existingRecord = items.find((i) => i.UnitID === UnitID);
    if (existingRecord) return alert("Record Already Exist");
    const newEntry: itemsList = {
      UnitID: data.unitID,
      unitName: data.unitName,
      storeID: StoreID,
      storeName: StoreName,
      categoryName: CategoryMainName,
      categoryID: CategoryMainID,
      SubCategoryName: SubCategoryMainName,
      FurtherSubCategoryName: FurtherSubCategory,
      SubCategroyMainName: SubCategoryMainName,
      SubCategoryMainID: SubCategoryMainID,
    };
    setUnitID("");
    setItems((prev) => [...prev, newEntry]);
  };
  const ModifyFurtherCategoryData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      const formData = {
        subCategoryID: SubCategoryMainID,
        subCategoryDetailID: DetailID,
        name: FurtherSubCategory,
        units: items.map((item) => ({
          unitID: item.UnitID || "",
        })),
      };
      const response = await ModifySubCategoryMoreApi(formData, String(token));
      if (response.status === 200) {
        setItems([]);
        setFurtherSubCategory("");
        setUnitID("");
        onShowMessage(
          response.message || "Category Added successfully",
          "success",
        );
      } else {
        onShowMessage(response.message, "error");
      }
    } finally {
      setLoading(false);
    }
  };
  const removeItem = (ID: string) => {
    const data = items.filter((item) => item.UnitID !== ID);
    if (data) {
      setItems(data);
    }
  };
  useEffect(() => {
    if (initialData) {
      console.log(initialData);
      setFurtherSubCategory(initialData.name);
      setSubCategoryMainID(initialData.subCategoryID);
      setDetailID(initialData.subCategoryDetailID);
      setItems(
        initialData.unit.map((item) => ({
          unitName: item.unitName,
          UnitID: item.unitID,
          FurtherSubCategoryName: initialData.name,
        })),
      );
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
              disabled={isFurtherSubCategoryLocked}
              className={`w-full px-4 py-2 rounded-lg  border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none transition
                ${
                  isFurtherSubCategoryLocked
                    ? "bg-gray-50 cursor-not-allowed"
                    : "bg-white"
                }`}
              onChange={(e) => {
                setStoreID(e.target.value);
                const data = storeList.find(
                  (item) => item.storeID === e.target.value,
                );
                if (data) {
                  setCategoryMainName(data.storeName);
                }
              }}
              //className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none transition"
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
              Main Category
            </label>
            <select
              value={CategoryMainID}
              disabled={isFurtherSubCategoryLocked}
              className={`w-full px-4 py-2 rounded-lg  border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none transition
                ${
                  isFurtherSubCategoryLocked
                    ? "bg-gray-50 cursor-not-allowed"
                    : "bg-white"
                }`}
              onChange={(e) => {
                setCategoryMainID(e.target.value);
                const data = catgeoryMainList.find(
                  (item) => item.categoryID === e.target.value,
                );
                if (data) {
                  setCategoryMainName(data.categoryName);
                }
              }}
              //className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none transition"
            >
              {catgeoryMainList.length === 0 ? (
                <option> No Category Found</option>
              ) : (
                <>
                  <option>Select Category</option>
                  {catgeoryMainList.map((item) => (
                    <option key={item.categoryID} value={item.categoryID}>
                      {item.categoryName}
                    </option>
                  ))}
                </>
              )}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Sub Category
            </label>
            <select
              value={SubCategoryMainID}
              disabled={isFurtherSubCategoryLocked}
              className={`w-full px-4 py-2 rounded-lg  border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none transition
                ${
                  isFurtherSubCategoryLocked
                    ? "bg-gray-50 cursor-not-allowed"
                    : "bg-white"
                }`}
              onChange={(e) => {
                setSubCategoryMainID(e.target.value);
                const data = catgeorySubList.find(
                  (item) => item.subCategoryID === e.target.value,
                );
                if (data) {
                  setSubCategoryMainName(data.subCategoryName);
                }
              }}
              //className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none transition"
            >
              {catgeorySubList.length === 0 ? (
                <option> No Sub-Category Found</option>
              ) : (
                <>
                  <option>Select Sub-Category</option>
                  {catgeorySubList.map((item) => (
                    <option key={item.subCategoryID} value={item.subCategoryID}>
                      {item.subCategoryName}
                    </option>
                  ))}
                </>
              )}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Unit
            </label>
            <select
              value={UnitID}
              onChange={(e) => {
                setUnitID(e.target.value);
              }}
              className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none transition"
            >
              {UnitList.length === 0 ? (
                <option> No Category Found</option>
              ) : (
                <>
                  <option>Select Category</option>
                  {UnitList.map((item) => (
                    <option key={item.unitID} value={item.unitID}>
                      {item.unitName}
                    </option>
                  ))}
                </>
              )}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Further Sub-Category Name
            </label>
            <div className="flex gap-1">
              <input
                type="text"
                value={FurtherSubCategory}
                onChange={(e) => setFurtherSubCategory(e.target.value)}
                disabled={isFurtherSubCategoryLocked}
                className={`w-full px-4 py-2 rounded-lg  border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none transition
                ${
                  isFurtherSubCategoryLocked
                    ? "bg-gray-50 cursor-not-allowed"
                    : "bg-white"
                }
            `}
                placeholder="Enter Sub-Category Name"
              />
              <button
                onClick={() => HadnleSaveItem()}
                className="px-2 py-2 bg-yellow-500 hover:bg-yellow-600 rounded-md shadow-md text-white"
              >
                <Plus />
              </button>
            </div>
          </div>
          {Update ? (
            <div className="flex justify-end">
              <button
                onClick={ModifyFurtherCategoryData}
                className="px-6 py-2 rounded-xl bg-neutral-900 text-white font-medium hover:bg-neutral-800 transition shadow-lg"
              >
                {loading ? "Updating..." : "Update"}
              </button>
            </div>
          ) : (
            <div className="flex justify-end">
              <button
                onClick={AddFurtherCategoryData}
                className="px-6 py-2 rounded-xl bg-neutral-900 text-white font-medium hover:bg-neutral-800 transition shadow-lg"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          )}
        </div>
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="py-3 px-4 text-sm text-neutral-500">#</th>
                <th className="py-3 px-4 text-sm text-neutral-500">Unit</th>
                <th className="py-3 px-4 text-sm text-neutral-500">
                  Sub-Category
                </th>
                <th className="py-3 px-4 text-sm text-neutral-500">
                  Further Sub-Category
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
                  <td className="py-3 px-4">{item.unitName}</td>
                  <td className="py-3 px-4">{item.SubCategoryName}</td>
                  <td className="py-3 px-4">{item.FurtherSubCategoryName}</td>

                  <td className="py-3 px-4">
                    <button
                      onClick={() => removeItem(item.UnitID || "")}
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
