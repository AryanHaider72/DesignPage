import GetCategoryMainApi from "@/api/lib/Admin/Codes/Category/GetCategoryMain/GetCategoryMain";
import GetCategoruSubApi from "@/api/lib/Admin/Codes/Category/SubCategory/GetSubCategory/GetSubCategory";
import GetSubCategoryMoreApi from "@/api/lib/Admin/Codes/Category/SubCatgeroyMore/GetSubCategoryMore/GetSubCategoryMore";
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
  FurtherSub,
  FurtherSubApiResponse,
} from "@/api/types/Admin/Codes/Category/SubCategoryMore/SubCategoryMore";
import {
  ResponseStoreList,
  storeListInital,
} from "@/api/types/Admin/Store/Store";
import { useEffect, useState } from "react";

interface UnitList {
  unitID: string;
  unitName: string;
}
interface ProductInformation {
  // supplierID: string;
  // invoiceNo: string;
  // purchaseDate: string;
  // productName: string;
  // discount: number;
  // threshold: number;
  // storeSale: string;
  // showinAllCountry: boolean;
  // feturedProduct: boolean;
  // showinCountry: boolean;
  // notShowinCountry: boolean;
  // description: string;
  storeID: string;
  length: number;
  height: number;
  depth: number;
  weight: number;
  categoryID: string;
  unitID: string;
  subCategoryDetailID: string;
  subCategoryID: string;
}
interface CategoryInformationProps {
  values: ProductInformation;
  onEdit: (DataList: ProductInformation) => void;
}
export default function CategoryInformation({
  values,
  onEdit,
}: CategoryInformationProps) {
  const [Length, setLength] = useState(Number(values.length));
  const [Weight, setWeight] = useState(Number(values.weight));
  const [Width, setWidth] = useState(Number(values.depth));
  const [Height, setHeight] = useState(Number(values.height));
  const [CategoryMainID, setCategoryMainID] = useState(values.categoryID);
  const [subCategoryMainID, setSubCategoryMainID] = useState(
    values.subCategoryID,
  );
  const [FurtherCategoryMainID, setFurtherCategoryMainID] = useState(
    values.subCategoryDetailID,
  );
  const [StoreID, setStoreID] = useState(values.storeID);
  const [UnitID, setUnitID] = useState(values.unitID);

  const [UnitList, setUnitList] = useState<UnitList[]>([]);
  const [catgeoryMainList, setCatgeoryMainList] = useState<CategoryMain[]>([]);
  const [storeList, setStoreList] = useState<storeListInital[]>([]);
  const [catgeorySubList, setCatgeorySubList] = useState<CategorySub[]>([]);
  const [FurtherCategorySubList, setFurtherCategorySubList] = useState<
    FurtherSub[]
  >([]);

  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const getStores = async () => {
    const token = localStorage.getItem("adminToken");
    const response = await GetInitalStoreSalesMan(String(token));
    const data = response.data as ResponseStoreList;

    if (data.storeList.length > 0) {
      setStoreList(data.storeList);

      // Only set default store if no value from props AND first load
      if (isInitialLoad && !values.storeID) {
        const defaultStoreID = data.storeList[0].storeID;
        setStoreID(defaultStoreID);
        getCategroyMain(defaultStoreID);
      } else if (values.storeID) {
        // If props already have storeID, call category API for it
        getCategroyMain(values.storeID);
      }
    } else {
      setStoreList([]);
    }
  };

  const getCategroyMain = async (storeID: string) => {
    const token = localStorage.getItem("adminToken");
    const response = await GetCategoryMainApi(String(token));

    if (response.status === 200 || response.status === 201) {
      const data = response.data as CategoryMainApiResponse;
      setCatgeoryMainList(data.categoryList);

      const selectedCategoryID =
        values.categoryID || data.categoryList[0].categoryID;

      setCategoryMainID(selectedCategoryID);

      getSubCategroy(selectedCategoryID, storeID);
    }
  };
  const getSubCategroy = async (ID: string, storeID: string) => {
    const formData = { categoryID: ID, storeID: storeID };
    const token = localStorage.getItem("adminToken");
    const response = await GetCategoruSubApi(String(token), formData);

    if (response.status === 200 || response.status === 201) {
      const data = response.data as CategorySubApiResponse;
      setCatgeorySubList(data.categoryList);
      const selectedSubID =
        values.subCategoryID || data.categoryList[0]?.subCategoryID;
      if (selectedSubID) {
        setSubCategoryMainID(selectedSubID);
        getFurtherSubCategroy(selectedSubID, storeID, ID);
      }
    } else {
      setCatgeorySubList([]);
    }
  };
  const getFurtherSubCategroy = async (
    subCat: string,
    Store: string,
    MainCat: string,
  ) => {
    const token = localStorage.getItem("adminToken");
    const formData = { subCategoryID: subCat, storeID: Store };
    const response = await GetSubCategoryMoreApi(String(token), formData);

    if (response.status === 200 || response.status === 201) {
      const data = response.data as FurtherSubApiResponse;
      setFurtherCategorySubList(data.categoryList);

      const initialFurtherID =
        FurtherCategoryMainID || data.categoryList[0]?.subCategoryDetailID;
      if (initialFurtherID) {
        setFurtherCategoryMainID(initialFurtherID);
        handleUnitList(initialFurtherID, data.categoryList);
      }
    }
  };

  const handleUnitList = (
    ID: string,
    sourceList: FurtherSub[] = FurtherCategorySubList,
  ) => {
    const data = sourceList.find((item) => item.subCategoryDetailID === ID);
    if (data) setUnitList(data.unit);
  };
  useEffect(() => {
    getStores();
  }, []);

  useEffect(() => {
    const formData = {
      storeID: StoreID,
      length: Width,
      height: Height,
      depth: Length,
      weight: Weight,
      categoryID: CategoryMainID,
      unitID: UnitID,
      subCategoryDetailID: FurtherCategoryMainID,
      subCategoryID: subCategoryMainID,
    };
    onEdit(formData);
  }, [
    StoreID,
    Width,
    Length,
    Height,
    Weight,
    CategoryMainID,
    subCategoryMainID,
    FurtherCategoryMainID,
    UnitID,
  ]);

  return (
    <>
      <div className="space-y-4">
        <div className="flex gap-2">
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-600 mb-1.5">
              Height
            </label>
            <input
              type="text"
              value={Height}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
              placeholder="Enter Product Name"
            />
          </div>
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-600 mb-1.5">
              Length
            </label>
            <input
              type="text"
              value={Length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
              placeholder="Enter Product Name"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-600 mb-1.5">
              Weight
            </label>
            <input
              type="text"
              value={Weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
              placeholder="Enter Product Name"
            />
          </div>
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-600 mb-1.5">
              Width
            </label>
            <input
              type="text"
              value={Width}
              onChange={(e) => setWidth(Number(e.target.value))}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
              placeholder="Enter Product Name"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1.5">
            Store
          </label>
          <div className="relative">
            <select
              value={StoreID}
              onChange={(e) => {
                getCategroyMain(e.target.value);
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
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1.5">
            Category
          </label>
          <div className="relative">
            <select
              value={CategoryMainID}
              onChange={(e) => {
                getSubCategroy(e.target.value, StoreID);
                setCategoryMainID(e.target.value);
              }}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition appearance-none cursor-pointer"
            >
              <option>Select Category</option>
              {catgeoryMainList.map((cat) => (
                <option key={cat.categoryID} value={cat.categoryID}>
                  {cat.categoryName}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1.5">
            Sub-Category
          </label>
          <div className="relative">
            <select
              value={subCategoryMainID}
              onChange={(e) => {
                setUnitList([]);
                setFurtherCategoryMainID("");

                getFurtherSubCategroy(e.target.value, StoreID, CategoryMainID);
                setSubCategoryMainID(e.target.value);
              }}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition appearance-none cursor-pointer"
            >
              <option>Select Sub-Category</option>
              {catgeorySubList.map((cat) => (
                <option key={cat.subCategoryID} value={cat.subCategoryID}>
                  {cat.subCategoryName}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1.5">
            Further-Sub-Category
          </label>
          <div className="relative">
            <select
              value={FurtherCategoryMainID}
              onChange={(e) => {
                setFurtherCategoryMainID(e.target.value);
                handleUnitList(e.target.value);
              }}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition appearance-none cursor-pointer"
            >
              <option>Select Further Category</option>
              {FurtherCategorySubList.map((cat) => (
                <option
                  key={cat.subCategoryDetailID}
                  value={cat.subCategoryDetailID}
                >
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1.5">
            Unit
          </label>
          <div className="relative">
            <select
              value={UnitID}
              onChange={(e) => {
                setUnitID(e.target.value);
              }}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition appearance-none cursor-pointer"
            >
              <option>Select Unit</option>
              {UnitList.map((cat) => (
                <option key={cat.unitID} value={cat.unitID}>
                  {cat.unitName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </>
  );
}
