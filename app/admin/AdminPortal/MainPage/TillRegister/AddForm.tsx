"use client";
import ModifyTillForPos from "@/api/lib/Admin/TillRegister/ModifyTill/ModifyTill";
import AddTillForPos from "@/api/lib/Admin/TillRegister/TillAdd/TillAdd";
import ProductSearchParam from "@/api/lib/ProductSearchParam/ProductSearchParam";
import {
  ProductFetchRepsonse,
  productList,
  Variant,
  VariantValue,
} from "@/api/types/Admin/SearchProduct/SearchProduct";
import { TillList } from "@/api/types/Admin/TillRegister/TillRegister";
import MessagePopUp from "@/app/UsefullComponent/MessagePopup/page";
import { Plus, Trash } from "lucide-react";
import { useEffect, useState } from "react";

interface Item {
  attributeID: string;
  barcode: string;
  name: string;
  qty: number;
  varient: string;
  subvarient: string;
}

interface AddTillFormProps {
  Update: boolean;
  TillID: string;
  onShowMessage: (message: string, type: "success" | "error") => void;
  initialData?: TillList | null;
}
export default function AddTillForm({
  onShowMessage,
  Update,
  initialData,
  TillID,
}: AddTillFormProps) {
  const [tillName, setTillName] = useState("");
  const [ProductName, setProductName] = useState("");
  const [VarientName, setVarientName] = useState("");
  const [SubVarientName, setSubVarientName] = useState("");
  const [attributeID, setAttributeID] = useState("");
  const [ProductID, setProductID] = useState("");

  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [varinetList, setVarinetList] = useState<Variant[]>([]);
  const [SubVarinetList, setSubVarinetList] = useState<VariantValue[]>([]);
  const [productList, setProductList] = useState<productList[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const productFetch = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const respone = await ProductSearchParam(String(token), ProductName);
      const data = respone.data as ProductFetchRepsonse;
      setProductList(data.productList);
    } finally {
    }
  };

  useEffect(() => {
    console.log(Update);
    if (initialData) {
      setTillName(initialData.tillName);
      setItems(
        initialData.tillSubList.map((p) => ({
          attributeID: p.attributeID,
          barcode: p.barcode,
          name: p.productName,
          qty: p.qty,
          varient: p.varinetName,
          subvarient: p.subVarientName,
        })),
      );
    }
  }, [initialData]);

  const FetchVarinet = (ID: string) => {
    const data = productList.find((item) => item.productID === ID);
    if (data) {
      setVarinetList(data.variants);
    }
  };
  const FetchVarientAttribute = (ID: string) => {
    const data = varinetList.find((item) => item.varientID === ID);
    if (data) {
      console.log(data);
      setSubVarinetList(data.variantValues);
    }
  };
  const AddIteminTable = () => {
    const product = productList.find((p) => p.productName === ProductName);
    if (!product) return alert("Product not found");

    const variant = varinetList.find((v) => v.varientID === VarientName);
    if (!variant) return alert("Variant not found");

    const subVariant = SubVarinetList.find(
      (sv) => sv.attributeID === SubVarientName,
    );
    if (!subVariant) return alert("Sub-variant not found");

    const existingRecord = items.find((i) => i.barcode === subVariant.barcode);
    if (existingRecord) return alert("Record Already Exist");

    const newItem: Item = {
      attributeID: subVariant.attributeID,
      barcode: subVariant.barcode,
      name: product.productName,
      qty: subVariant.qty,
      varient: variant.variantName,
      subvarient: subVariant.varientValue,
    };

    setItems((prev) => [...prev, newItem]);
    setProductName("");
    setVarinetList([]);
    setSubVarinetList([]);
  };

  const removeItemFromList = (index: string) => {
    const data = items.filter((item) => item.barcode !== index);
    setItems(data);
  };

  useEffect(() => {
    if (!ProductName || ProductName.trim().length === 0) return;

    const delayDebounce = setTimeout(() => {
      productFetch();
    }, 500); // ⏱ 500ms debounce

    return () => clearTimeout(delayDebounce); // cleanup
  }, [ProductName]);

  // -------------------------------------------Add Function----------------------------------------

  const addTill = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("adminToken");

      const formData = {
        tillName: tillName,
        listProduct: items.map((item) => ({
          attributeID: item.attributeID,
          qty: item.qty,
        })),
      };

      const response = await AddTillForPos(formData, String(token));

      if (response.status === 200) {
        onShowMessage(response.message || "Till added successfully", "success");
        // Reset form
        setTillName("");
        setItems([]);
        setProductName("");
        setSubVarinetList([]);
        setVarinetList([]);
      } else {
        onShowMessage(response.message || "Something went wrong", "error");
      }
    } catch (err) {
      onShowMessage("Network error. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };
  const ModifyTill = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("adminToken");

      const formData = {
        TillID: TillID,
        tillName: tillName,
        listProduct: items.map((item) => ({
          attributeID: item.attributeID,
          qty: item.qty,
        })),
      };

      const response = await ModifyTillForPos(formData, String(token));

      if (response.status === 200) {
        onShowMessage(
          response.message || "Till Modified successfully",
          "success",
        );
        // Reset form
        setTillName("");
        setItems([]);
        setProductName("");
        setSubVarinetList([]);
        setVarinetList([]);
      } else {
        onShowMessage(response.message || "Something went wrong", "error");
      }
    } catch (err) {
      onShowMessage("Network error. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="w-full flex flex-col lg:flex-row gap-8">
        {/* FORM */}
        <div className="w-full lg:max-w-md space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Till Name
            </label>
            <input
              type="text"
              value={tillName}
              onChange={(e) => setTillName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none transition"
              placeholder="Till Name"
            />
          </div>

          <div className="relative w-full">
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Product Name
            </label>

            <input
              type="text"
              value={ProductName}
              onChange={(e) => {
                const value = e.target.value;
                setProductName(value);
                setShowDropdown(true);
              }}
              onFocus={() => productList.length && setShowDropdown(true)}
              className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none transition"
              placeholder="Search product..."
            />

            {/* LOADER */}
            {isLoading && (
              <div className="absolute right-3 top-9">
                <div className="w-4 h-4 border-2 border-neutral-300 border-t-neutral-900 rounded-full animate-spin" />
              </div>
            )}

            {/* DROPDOWN */}
            {ProductName && showDropdown && productList.length > 0 && (
              <div
                className="absolute z-50 mt-2 w-full bg-white
                 rounded-xl shadow-xl shadow-neutral-300/40
                 max-h-80 overflow-y-auto"
              >
                {productList.map((item) => (
                  <div
                    key={item.productID}
                    onClick={() => {
                      setProductName(item.productName);
                      setProductID(item.productID);
                      setShowDropdown(false);
                      FetchVarinet(item.productID);
                    }}
                    className="flex items-center gap-3 px-4 py-3 cursor-pointer
                     hover:bg-neutral-100 transition"
                  >
                    <img
                      src={item.images?.[0]?.url || "/placeholder.jpg"}
                      alt={item.productName}
                      className="w-10 h-10 rounded-lg object-cover shadow-sm"
                    />

                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-neutral-900">
                        {item.productName}
                      </span>
                      <span className="text-xs text-neutral-500">
                        {item.storeName}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Variant Name
            </label>
            <select
              value={VarientName}
              onChange={(e) => {
                setVarientName(e.target.value);
                FetchVarientAttribute(e.target.value);
              }}
              className="w-full px-4 py-3 rounded-lg border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none transition"
            >
              <option className="">Select Varient</option>
              {varinetList.map((item) => (
                <option key={item.varientID} value={item.varientID}>
                  {item.variantName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              SubVariant Name
            </label>
            <div className="flex gap-1">
              <select
                value={SubVarientName}
                onChange={(e) => {
                  setSubVarientName(e.target.value);
                  FetchVarientAttribute(e.target.value);
                }}
                className="w-full px-4 py-3 rounded-lg border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none transition"
              >
                <option className="">Select Sub-Varient</option>
                {SubVarinetList.map((item) => (
                  <option key={item.attributeID} value={item.attributeID}>
                    {item.varientValue}
                  </option>
                ))}
              </select>
              <button
                onClick={AddIteminTable}
                className="px-2 py-2 text-white rounded-md shadow-md cursor-pointer bg-yellow-500 hover:bg-yellow-600"
              >
                <Plus />
              </button>
            </div>
          </div>
          {Update ? (
            <div className="flex justify-end">
              <button
                onClick={ModifyTill}
                className="px-6 py-2 rounded-xl bg-neutral-900 text-white font-medium hover:bg-neutral-800 transition shadow-lg"
              >
                {isLoading ? "Updating Item..." : "Update Item"}
              </button>
            </div>
          ) : (
            <div className="flex justify-end">
              <button
                onClick={addTill}
                className="px-6 py-2 rounded-xl bg-neutral-900 text-white font-medium hover:bg-neutral-800 transition shadow-lg"
              >
                {isLoading ? "Adding Item..." : "Add Item"}
              </button>
            </div>
          )}
        </div>

        {/* TABLE */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="py-3 px-4 text-sm text-neutral-500">Barcode</th>
                <th className="py-3 px-4 text-sm text-neutral-500">Name</th>
                <th className="py-3 px-4 text-sm text-neutral-500">Vareint</th>
                <th className="py-3 px-4 text-sm text-neutral-500">
                  SubVarient
                </th>
                <th className="py-3 px-4 text-sm text-neutral-500">Quantity</th>

                <th className="py-3 px-4 text-sm text-neutral-500">Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-neutral-100 hover:bg-neutral-100/50 transition"
                >
                  <td className="py-3 px-4">{item.barcode}</td>
                  <td className="py-3 px-4">{item.name}</td>
                  <td className="py-3 px-4">{item.varient}</td>
                  <td className="py-3 px-4">{item.subvarient}</td>
                  <td className="py-3 px-4">{item.qty}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => removeItemFromList(item.barcode)}
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
