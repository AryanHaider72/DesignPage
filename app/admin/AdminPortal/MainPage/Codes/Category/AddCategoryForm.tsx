"use client";
import GetCategoryMainApi from "@/api/lib/Admin/Codes/Category/GetCategoryMain/GetCategoryMain";
import AddSubCategoryApi from "@/api/lib/Admin/Codes/Category/SubCategory/AddSubCategory/AddSubCategory";
import ModifyCatgeroySubApi from "@/api/lib/Admin/Codes/Category/SubCategory/ModifySubCategory/ModifyCatgeroySub";
import GetInitalStoreSalesMan from "@/api/lib/Admin/Stores/GetInitalStore/GetInitalStore";
import {
  CategoryMain,
  CategoryMainApiResponse,
} from "@/api/types/Admin/Codes/Category/MainCategory/MainCateogry";
import { CategorySub } from "@/api/types/Admin/Codes/Category/SubCategory/SubCategory";
import {
  ResponseStoreList,
  storeListInital,
} from "@/api/types/Admin/Store/Store";
import { useEffect, useState } from "react";

interface AddUnitProps {
  initialData?: CategorySub | null;
  storeID: string;
  Update: boolean;
  onShowMessage: (message: any, type: "success" | "error") => void;
}
export default function AddCategoryForm({
  Update,
  onShowMessage,
  initialData,
  storeID,
}: AddUnitProps) {
  const [loading, setLoading] = useState(false);
  const [StoreID, setStoreID] = useState("");
  const [catgeoryMainList, setCatgeoryMainList] = useState<CategoryMain[]>([]);
  const [storeList, setStoreList] = useState<storeListInital[]>([]);
  const [CategoryMainID, setCategoryMainID] = useState("");
  const [SubCategory, setSubCategory] = useState("");
  const [Description, setDescription] = useState("");
  const [ID, setID] = useState("");

  const getCategroyMain = async () => {
    const token = localStorage.getItem("adminToken");
    const response = await GetCategoryMainApi(String(token));

    if (response.status === 200 || response.status === 201) {
      const data = response.data as CategoryMainApiResponse;
      setCatgeoryMainList(data.categoryList);
      setCategoryMainID(data.categoryList[0].categoryID);
      //getCategorySub(data.categoryList[0].categoryID);
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
      } else {
        setStoreID(data.storeList[0].storeID);
      }
    } else {
      setStoreList([]);
    }
  };

  const AddCategoryData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      const formData = {
        categoryID: CategoryMainID,
        storeID: StoreID,
        subCategoryName: SubCategory,
        description: Description,
      };
      const response = await AddSubCategoryApi(formData, String(token));
      if (response.status === 200 || response.status === 201) {
        setSubCategory("");
        setDescription("");
        onShowMessage(
          response.message || "Sub-Category Added successfully",
          "success",
        );
      } else {
        onShowMessage(response.message, "error");
      }
    } finally {
      setLoading(false);
    }
  };
  const ModifyCategoryData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      const formData = {
        subCategoryID: ID,
        categoryID: CategoryMainID,
        storeID: StoreID,
        subCategoryName: SubCategory,
        description: Description,
      };
      const response = await ModifyCatgeroySubApi(formData, String(token));
      if (response.status === 200 || response.status === 201) {
        setSubCategory("");
        setDescription("");
        setID("");
        onShowMessage(
          response.message || "Sub-Category Modifed successfully",
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
    getStores();
    getCategroyMain();
  }, []);
  useEffect(() => {
    if (initialData) {
      setID(initialData.subCategoryID);
      setStoreID(storeID);
      setCategoryMainID(initialData.categoryID);
      setSubCategory(initialData.subCategoryName);
      setDescription(initialData.description);
    }
  }, [initialData]);
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
              Main Category
            </label>
            <select
              value={CategoryMainID}
              onChange={(e) => {
                setCategoryMainID(e.target.value);
              }}
              className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none transition"
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
              Sub-Category Name
            </label>
            <input
              type="text"
              value={SubCategory}
              onChange={(e) => setSubCategory(e.target.value)}
              placeholder="Enter Sub-Category Name"
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
                onClick={ModifyCategoryData}
                className="px-6 py-2 rounded-xl bg-neutral-900 text-white font-medium hover:bg-neutral-800 transition shadow-lg"
              >
                {loading ? "Updating..." : "Update"}
              </button>
            </div>
          ) : (
            <div className="flex justify-end">
              <button
                onClick={AddCategoryData}
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
