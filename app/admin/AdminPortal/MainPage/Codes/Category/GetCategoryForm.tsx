import GetCategoryMainApi from "@/api/lib/Admin/Codes/Category/GetCategoryMain/GetCategoryMain";
import DeleteCategorySubApi from "@/api/lib/Admin/Codes/Category/SubCategory/DeleteSubCategory/DeleteSubCategroy";
import GetCategoruSubApi from "@/api/lib/Admin/Codes/Category/SubCategory/GetSubCategory/GetSubCategory";
import GetInitalStoreSalesMan from "@/api/lib/Admin/Stores/GetInitalStore/GetInitalStore";
import {
  CategoryMain,
  CategoryMainApiResponse,
} from "@/api/types/Admin/Codes/Category/MainCategory/MainCateogry";
import {
  CategorySub,
  CategorySubApiResponse,
} from "@/api/types/Admin/Codes/Category/SubCategory/SubCategory";
import {
  ResponseStoreList,
  storeListInital,
} from "@/api/types/Admin/Store/Store";
import DeleteComponent from "@/app/UsefullComponent/DeleteComponent/page";
import Spinner from "@/app/UsefullComponent/Spinner/page";
import { Pencil, Trash } from "lucide-react";
import { useEffect, useState } from "react";
interface AddExpenseProps {
  onEdit: (Datalist: CategorySub, StoreID: string) => void;
  onShowMessage: (message: any, type: "success" | "error") => void;
}
export default function GetCategoryForm({
  onEdit,
  onShowMessage,
}: AddExpenseProps) {
  const [loading, setLoading] = useState(false);
  const [StoreID, setStoreID] = useState("");
  const [catgeoryMainList, setCatgeoryMainList] = useState<CategoryMain[]>([]);
  const [storeList, setStoreList] = useState<storeListInital[]>([]);
  const [catgeorySubList, setCatgeorySubList] = useState<CategorySub[]>([]);
  const [CategoryMainID, setCategoryMainID] = useState("");
  const [ID, setID] = useState("");
  const [Delete, setDelete] = useState(false);

  const getCategroyMain = async (storeID: string) => {
    const token = localStorage.getItem("adminToken");
    const response = await GetCategoryMainApi(String(token));

    if (response.status === 200 || response.status === 201) {
      const data = response.data as CategoryMainApiResponse;
      setCatgeoryMainList(data.categoryList);
      setCategoryMainID(data.categoryList[0].categoryID);

      getSubCategroy(data.categoryList[0].categoryID, storeID);
    }
  };

  const getStores = async () => {
    const token = localStorage.getItem("adminToken");
    const response = await GetInitalStoreSalesMan(String(token));
    const data = response.data as ResponseStoreList;
    if (data.storeList.length > 0) {
      setStoreList(data.storeList);
      const storeID = data.storeList[0].storeID;
      console.log(storeID);
      setStoreID(storeID);

      getCategroyMain(storeID);
    } else {
      setStoreList([]);
    }
  };

  const getSubCategroy = async (ID: string, storeID: string) => {
    try {
      setLoading(true);
      const formData = {
        categoryID: ID,
        storeID: storeID,
      };
      const token = localStorage.getItem("adminToken");
      const response = await GetCategoruSubApi(String(token), formData);
      if (response.status === 200 || response.status === 201) {
        const data = response.data as CategorySubApiResponse;
        setCatgeorySubList(data.categoryList);
      } else {
        setCatgeorySubList([]);
      }
    } catch (err) {
      // setResponseBack(3);
    } finally {
      setLoading(false);
    }
  };
  const SubCategoryDelete = async (ID: string) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      const formData = {
        subCategoryID: ID,
        storeID: StoreID,
      };
      const response = await DeleteCategorySubApi(formData, String(token));
      if (response.status === 200 || response.status === 201) {
        const data = catgeorySubList.filter(
          (item) => item.subCategoryID !== ID,
        );
        setCatgeorySubList(data);
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
    const data = catgeorySubList.find((item) => item.subCategoryID === ID);
    if (data) {
      const formData = {
        categoryID: data.categoryID,
        subCategoryID: data.subCategoryID,
        subCategoryName: data.subCategoryName,
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
          onConfirm={() => SubCategoryDelete(ID)}
        />
      )}
      <div className="mt-2 ">
        <label className="block text-sm font-medium text-neutral-700 mb-1">
          Stores
        </label>
        <select
          value={StoreID}
          onChange={(e) => {
            setStoreID(e.target.value);
            getSubCategroy(CategoryMainID, e.target.value);
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
        <label className="block text-sm font-medium text-neutral-700 mb-1">
          Main Category
        </label>
        <select
          value={CategoryMainID}
          onChange={(e) => {
            setCategoryMainID(e.target.value);
            getSubCategroy(e.target.value, StoreID);
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
      <div className="mt-2 ">
        {loading ? (
          <div className="flex justify-center py-10">
            <Spinner />
          </div>
        ) : (
          <>
            {catgeorySubList.length > 0 ? (
              <div className="space-y-4">
                {catgeorySubList.map((item) => (
                  <div
                    key={item.subCategoryID}
                    className="flex items-center justify-between bg-white shadow-md rounded-lg p-4 hover:shadow-xl transition relative"
                  >
                    {/* Left: Till Info */}
                    <div className="flex flex-col">
                      <span className="text-lg font-semibold text-gray-800">
                        {item.subCategoryName}
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
                        onClick={() => fetchData(item.subCategoryID)}
                      >
                        <Pencil />
                      </button>

                      <button
                        onClick={() => {
                          setDelete(true);
                          setID(item.subCategoryID);
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
