"use client";
import GetSupplierApi from "@/api/lib/Admin/Codes/Supplier/GetSupplier/GetSupplier";
import GetCountry from "@/api/lib/Admin/Country/countryGet";
import {
  ResponseSupplierGetData,
  SupplierData,
} from "@/api/types/Admin/Codes/Supplier/Supplier";
import {
  Countryget,
  CountrygetApiResponse,
} from "@/api/types/Admin/Shipment/Country/Country";
import { Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { itemAxisPredicate } from "recharts/types/state/selectors/axisSelectors";

interface ListingCountries {
  countryID: string;
  countryName: string;
}

interface ProductInformation {
  supplierID: string;
  invoiceNo: string;
  purchaseDate: string;
  purchaseAdd: boolean;
  featuredProducts: boolean;
  productName: string;
  discount: number;
  threshold: number;
  storeSale: string;
  showinAllCountry: boolean;
  feturedProduct: boolean;
  showinCountry: boolean;
  notShowinCountry: boolean;
  description: string;
  listCountry: ListingCountries[];
}
interface ProductINformationPassProps {
  values: ProductInformation;
  onEdit: (Datalist: ProductInformation) => void;
}
export default function ProductInformation({
  values,
  onEdit,
}: ProductINformationPassProps) {
  const [CountryID, setCountryID] = useState("");
  const [CountryName, setCountryName] = useState("");
  const [ProductName, setProductName] = useState(values.productName);
  const [SupplierID, setSupplierID] = useState(values.supplierID);
  const [Description, setDescription] = useState(values.description);
  const [Threshold, setThreshold] = useState(Number(values.threshold));
  const [Discount, setDiscount] = useState(Number(values.discount));

  const [StoreSale, setStoreSale] = useState(values.storeSale);
  const [PurchaseAdd, setPurchaseAdd] = useState(
    values.purchaseAdd ? "No" : "Yes",
  );
  const [FeaturedProduct, setFeaturedProduct] = useState(
    values.feturedProduct ? "Yes" : "No",
  );
  const [CountryRestrict, setCountryRestrict] = useState(
    values.showinAllCountry
      ? "ShowInAllCountry"
      : values.showinCountry
        ? "ShowInSomeCountry"
        : "HideInSomeCountry",
  );
  const [SupplierList, setSupplierList] = useState<SupplierData[]>([]);
  const [listofCountry, setListofCountry] = useState<Countryget[]>([]);
  const [ListingCountries, setListingCountries] = useState<ListingCountries[]>(
    values.listCountry,
  );

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
  useEffect(() => {
    if (!SupplierList.length) {
      SupplierGet();
    }
    getCountry();
  }, []);

  useEffect(() => {
    const formData = {
      supplierID: SupplierID || "dc4f35c5-8b69-454b-b3c5-75f16b2c54be",
      invoiceNo: "",
      purchaseDate: new Date().toISOString().split("T")[0],
      productName: ProductName,
      discount: Discount,
      threshold: Threshold,
      featuredProducts: FeaturedProduct === "Yes" ? true : false,
      storeSale: StoreSale,
      purchaseAdd: PurchaseAdd === "Yes",
      feturedProduct: FeaturedProduct === "Yes",
      showinAllCountry: CountryRestrict === "ShowInAllCountry",
      showinCountry: CountryRestrict === "ShowInSomeCountry",
      notShowinCountry: CountryRestrict === "HideInSomeCountry",
      listCountry: ListingCountries.map((item) => ({
        countryID: item.countryID,
        countryName: item.countryName,
      })),
      description: Description,
    };
    onEdit(formData);
  }, [
    SupplierID,
    ProductName,
    Discount,
    Threshold,
    StoreSale,
    FeaturedProduct,
    CountryRestrict,
    Description,
  ]);
  return (
    <>
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
            Purchase
          </label>

          <div className="flex flex-wrap  gap-4 ">
            {/* Option 1 */}
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="supplier"
                value="Yes"
                checked={PurchaseAdd === "Yes"}
                onChange={(e) => setPurchaseAdd("Yes")}
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
                name="supplier"
                value="No"
                checked={PurchaseAdd === "No"}
                onChange={(e) => setPurchaseAdd("No")}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-700 text-sm font-medium">No</span>
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
              <span className="ml-2 text-gray-700 text-sm font-medium">No</span>
            </label>
          </div>
        </div>
        {PurchaseAdd !== "No" && (
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">
              Supplier
            </label>
            <div className="relative">
              <select
                value={SupplierID}
                onChange={(e) => setSupplierID(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition appearance-none cursor-pointer"
              >
                <option>Select Supplier</option>
                {SupplierList.map((cat) => (
                  <option key={cat.supplierID} value={cat.supplierID}>
                    {cat.supplierName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
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
                onClick={() => handleSaveCountriesList(CountryID, CountryName)}
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
    </>
  );
}
