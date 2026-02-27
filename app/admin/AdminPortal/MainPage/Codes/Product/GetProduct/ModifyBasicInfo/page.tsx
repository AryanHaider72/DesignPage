import GetCategoryMainApi from "@/api/lib/Admin/Codes/Category/GetCategoryMain/GetCategoryMain";
import GetCategoruSubApi from "@/api/lib/Admin/Codes/Category/SubCategory/GetSubCategory/GetSubCategory";
import GetSubCategoryMoreApi from "@/api/lib/Admin/Codes/Category/SubCatgeroyMore/GetSubCategoryMore/GetSubCategoryMore";
import ModifyProductBasicInfo from "@/api/lib/Admin/Codes/Product/ModifyProduct/ModifyBasicInfo/ModifyBasicInfo";
import GetSupplierApi from "@/api/lib/Admin/Codes/Supplier/GetSupplier/GetSupplier";
import GetCountry from "@/api/lib/Admin/Country/countryGet";
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
  ResponseSupplierGetData,
  SupplierData,
} from "@/api/types/Admin/Codes/Supplier/Supplier";
import {
  Countryget,
  CountrygetApiResponse,
} from "@/api/types/Admin/Shipment/Country/Country";
import {
  ResponseStoreList,
  storeListInital,
} from "@/api/types/Admin/Store/Store";
import { Plus, X } from "lucide-react";
import { useEffect, useState } from "react";

interface UnitList {
  unitID: string;
  unitName: string;
}
interface ModfiyBasicInfoData {
  storeID: string;
  supplierID: string;
  storeName: string;
  productID: string;
  storeSale: string;
  categoryID: string;
  subCategoryID: string;
  subCategoryDetailID: string;
  unitID: string;
  productName: string;
  description: string;
  feturedProduct: boolean;
  discount: number;
  currentStock: number;
  threshold: number;
  width: number;
  height: number;
  depth: number;
  weight: number;
  showinAllCountry: boolean;
  showinCountry: boolean;
  notShowinCountry: boolean;
  countryList: countryList[];
}
type countryList = {
  countryID: string;
  countryName: string;
};

interface PassModifyBasicInfo {
  values: ModfiyBasicInfoData;
  isOpen: (isOpen: string) => void;
  onShowMessage: (message: any, type: "success" | "error") => void;
}
interface ListingCountries {
  countryID: string;
  countryName: string;
}

export default function ModifyBasicInfo({
  values,
  isOpen,
  onShowMessage,
}: PassModifyBasicInfo) {
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [CountryID, setCountryID] = useState("");
  const [CountryName, setCountryName] = useState("");
  const [ProductName, setProductName] = useState(values.productName);
  const [SupplierID, setSupplierID] = useState(values.supplierID);
  const [Description, setDescription] = useState(values.description);
  const [Threshold, setThreshold] = useState(values.threshold);
  const [Discount, setDiscount] = useState(values.discount);

  const [StoreSale, setStoreSale] = useState(values.storeSale);
  const [PurchaseAdd, setPurchaseAdd] = useState("");
  const [FeaturedProduct, setFeaturedProduct] = useState(
    values.feturedProduct ? "Yes" : "No",
  );
  const [CountryRestrict, setCountryRestrict] = useState(
    values.showinAllCountry
      ? "ShowInAllCountry"
      : values.notShowinCountry
        ? "notShowInCountry"
        : "ShowInSomeCountry",
  );
  const [SupplierList, setSupplierList] = useState<SupplierData[]>([]);
  const [listofCountry, setListofCountry] = useState<Countryget[]>([]);
  const [ListingCountries, setListingCountries] = useState<ListingCountries[]>(
    values.countryList.map((item) => ({
      countryID: item.countryID || "",
      countryName: item.countryName || "",
    })),
  );
  const [Length, setLength] = useState(values.depth);
  const [Weight, setWeight] = useState(values.weight);
  const [Width, setWidth] = useState(values.width);
  const [Height, setHeight] = useState(values.height);
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

  const SupplierGet = async () => {
    const token = localStorage.getItem("adminToken");
    const response = await GetSupplierApi(String(token));
    if (response.status === 200 || response.status === 201) {
      const data = response.data as ResponseSupplierGetData;
      setSupplierList(data.supplierList);
      console.log(data.supplierList);
      if (!SupplierID) {
        setSupplierID(data.supplierList[0].supplierID);
      }
    } else {
      setSupplierList([]);
    }
  };
  const getCountry = async () => {
    const token = localStorage.getItem("token");
    const response = await GetCountry(String(token));
    if (response.status === 201 || response.status === 200) {
      const data = response.data as CountrygetApiResponse;
      setListofCountry(data.countryList);
    }
  };
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

  const basicInfo = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      const formData = {
        productID: values.productID,
        storeID: StoreID,
        categoryID: CategoryMainID,
        productName: ProductName,
        subCategoryDetailID: FurtherCategoryMainID,
        subCategoryID: subCategoryMainID,
        unitID: UnitID,
        discount: Discount,
        currentStock: 0,
        threshold: Threshold,
        percentage: 0,
        showinAllCountry: CountryRestrict === "ShowInAllCountry",
        showinCountry: CountryRestrict === "ShowInSomeCountry",
        notShowinCountry: CountryRestrict === "HideInSomeCountry",
        description: Description,
        width: Width,
        height: Height,
        depth: Length,
        weight: Weight,
        listCountry: ListingCountries.map((item) => ({
          countryID: item.countryID,
        })),
      };
      const response = await ModifyProductBasicInfo(formData, String(token));
      if (response.status === 200) {
        isOpen("");
        onShowMessage(
          response.message || "Product Modifed successfully",
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
    getCountry();
    SupplierGet();
    getStores();
  }, []);

  const handleSaveCountriesList = (ID: string, Name: string) => {
    const data = ListingCountries.find((item) => item.countryID === ID);
    if (data) return alert("Record Already Exist");
    const newEntry: ListingCountries = {
      countryID: ID,
      countryName: Name,
    };
    setListingCountries((prev) => [...prev, newEntry]);
    setCountryID("");
    setCountryName("");
  };
  const handleRemoveHideCountry = (ID: string) => {
    const data = ListingCountries.filter((item) => item.countryID !== ID);
    if (data) {
      setListingCountries(data);
    }
  };
  return (
    <div className="fixed inset-0 z-[50] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => isOpen("")}
      />

      {/* Modal - centered */}
      <div className="relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-3xl mx-auto max-h-[90vh] overflow-y-auto">
        <button
          onClick={() => isOpen("")}
          title="Close"
          className=" w-full rounded-full  flex items-end justify-end transition group"
        >
          <X className="w-7 h-7 text-gray-500 group-hover:text-red-500 transition cursor-pointer" />
        </button>
        {/* Header */}
        <h1 className="text-xl font-semibold text-gray-800">Basic Info</h1>
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center">
            {/* Step 1 */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm 
                                    ${
                                      currentStep === 1
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-300 text-black"
                                    }`}
            >
              1
            </div>
            <span
              className={`mx-2 text-sm font-medium ${
                currentStep === 1 ? "text-blue-600" : "text-gray-500"
              }`}
            >
              Product Info
            </span>

            {/* Line to Step 2 */}
            <div
              className={`h-1 w-10 ${
                currentStep === 2 ? "bg-blue-600" : "bg-gray-300"
              }`}
            ></div>

            {/* Step 2 */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm 
                                    ${
                                      currentStep === 2
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-300 text-black"
                                    }`}
            >
              2
            </div>
            <span
              className={`mx-2 text-sm font-medium ${
                currentStep === 2 ? "text-blue-600" : "text-gray-500"
              }`}
            >
              Category Info
            </span>
          </div>
        </div>
        {/* Content */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="mt-2 rounded-xl max-w-md">
              <label className="block text-sm font-medium text-gray-600 mb-1.5">
                Store Sale
              </label>
              <div className="flex flex-wrap  gap-4 ">
                {/* Option 1 */}
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="StoreSale"
                    value="Both"
                    checked={StoreSale === "Both"}
                    onChange={(e) => setStoreSale("Both")}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700 text-sm font-medium">
                    Both
                  </span>
                </label>

                {/* Option 2 */}
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="StoreSale"
                    value="OnlineStore"
                    checked={StoreSale === "OnlineStore"}
                    onChange={(e) => setStoreSale("OnlineStore")}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700 text-sm font-medium">
                    Online Store
                  </span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="StoreSale"
                    value="OfflineStore"
                    checked={StoreSale === "OfflineStore"}
                    onChange={(e) => setStoreSale("OfflineStore")}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700 text-sm font-medium">
                    Offline Store
                  </span>
                </label>
              </div>
            </div>
            <div className="mt-2 rounded-xl max-w-md">
              <label className="block text-sm font-medium text-gray-600 mb-1.5">
                Featured Product
              </label>

              <div className="flex flex-wrap  gap-4 ">
                {/* Option 1 */}
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="featured"
                    value="Yes"
                    checked={FeaturedProduct === "Yes"}
                    onChange={(e) => setFeaturedProduct("Yes")}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700 text-sm font-medium">
                    Yes
                  </span>
                </label>

                {/* Option 2 */}
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="featured"
                    value="No"
                    checked={FeaturedProduct === "No"}
                    onChange={(e) => setFeaturedProduct("No")}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700 text-sm font-medium">
                    No
                  </span>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">
                Product Name
              </label>
              <input
                type="text"
                value={ProductName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
                placeholder="Enter Product Name"
              />
            </div>
            <div className="flex gap-2">
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-600 mb-1.5">
                  Discount
                </label>
                <input
                  type="text"
                  value={Discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
                  placeholder="Enter Product Name"
                />
              </div>
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-600 mb-1.5">
                  Threshold
                </label>
                <input
                  type="text"
                  value={Threshold}
                  onChange={(e) => setThreshold(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
                  placeholder="Enter Product Name"
                />
              </div>
            </div>

            <div className="mt-2 rounded-xl max-w-md">
              <label className="block text-sm font-medium text-gray-600 mb-1.5">
                Show in Country
              </label>
              <div className="flex flex-wrap  gap-4 ">
                {/* Option 1 */}
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="CountryRestrict"
                    value="ShowInAllCountry"
                    checked={CountryRestrict === "ShowInAllCountry"}
                    onChange={(e) => setCountryRestrict("ShowInAllCountry")}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700 text-sm font-medium">
                    Show in All Country
                  </span>
                </label>

                {/* Option 2 */}
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="CountryRestrict"
                    value="ShowInSomeCountry"
                    checked={CountryRestrict === "ShowInSomeCountry"}
                    onChange={(e) => setCountryRestrict("ShowInSomeCountry")}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700 text-sm font-medium">
                    Show in Some Country
                  </span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="CountryRestrict"
                    value="HideInSomeCountry"
                    checked={CountryRestrict === "HideInSomeCountry"}
                    onChange={(e) => setCountryRestrict("HideInSomeCountry")}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700 text-sm font-medium">
                    Hide in Some Country
                  </span>
                </label>
              </div>
            </div>
            {CountryRestrict !== "ShowInAllCountry" && (
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">
                  Country
                </label>
                <div className="flex gap-1">
                  <select
                    value={CountryID}
                    onChange={(e) => {
                      setCountryID(e.target.value);
                      const data = listofCountry.find(
                        (item) => item.countryID === e.target.value,
                      );
                      if (data) {
                        setCountryName(data.countryName);
                      }
                    }}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition appearance-none cursor-pointer"
                  >
                    <option>Select Country</option>
                    {listofCountry.map((cat) => (
                      <option key={cat.countryID} value={cat.countryID}>
                        {cat.countryName}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() =>
                      handleSaveCountriesList(CountryID, CountryName)
                    }
                    className="px-2 py-2 text-white rounded-md bg-yellow-500 hover:bg-yellow-600"
                  >
                    <Plus />
                  </button>
                </div>
                {ListingCountries.map((item, index) => (
                  <div
                    key={index}
                    className="inline-flex mx-2  mt-1 items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium border border-green-300 shadow-sm"
                  >
                    <span>{item.countryName}</span>
                    <X
                      size={16}
                      className="cursor-pointer hover:text-red-500 transition"
                      onClick={() => handleRemoveHideCountry(item.countryID)}
                    />
                  </div>
                ))}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">
                Description
              </label>
              <textarea
                value={Description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
                placeholder="Enter Description"
              />
            </div>
          </div>
        )}
        {currentStep === 2 && (
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

                      getFurtherSubCategroy(
                        e.target.value,
                        StoreID,
                        CategoryMainID,
                      );
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
        )}
        {currentStep === 1 && (
          <div className="mt-6 flex justify-between gap-4">
            <button
              // onClick={() => setProductAbout(false)}
              className="px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-400 transition"
              disabled
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentStep(2)}
              className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition flex items-center justify-center gap-2"
            >
              Next
              {/* {loading ? "Saving..." : "Save"} */}
            </button>
          </div>
        )}
        {currentStep === 2 && (
          <div className="mt-6 flex justify-between gap-4">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 hover:bg-gray-100 transition"
            >
              Previous
            </button>
            <button
              onClick={() => basicInfo()}
              className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition flex items-center justify-center gap-2"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
