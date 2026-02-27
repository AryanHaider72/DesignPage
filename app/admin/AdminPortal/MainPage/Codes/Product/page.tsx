"use client";
import { List, Plus } from "lucide-react";
import { useState } from "react";
import ProductAddForm from "./ProductAddForm";
import MessagePopUp from "@/app/UsefullComponent/MessagePopup/page";
import GetProductsFunctionForm from "./GetProductForm";
import ModifyBasicInfo from "./GetProduct/ModifyBasicInfo/page";
import ModifyVarientForm from "./GetProduct/ModifyVarient/ModifyVarient";
interface ModfiyBasicInfoData {
  storeID: string;
  storeName: string;
  productID: string;
  supplierID: string;
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
interface Variant {
  varientID: string;
  variantName: string;
  variantValues: VariantValue[];
}
type VariantValue = {
  attributeID: string;
  varientValue: string;
  costPrice: number;
  salePrice: number;
  qty: number;
  barcode: string;
};

export default function ProductForm() {
  const [view, setView] = useState<"list" | "form">("list");
  const [showMessage, setShowMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success",
  );
  const [refreshKey, setRefreshKey] = useState(0);
  const [ModfiyBasicInfoData, setModfiyBasicInfoData] =
    useState<ModfiyBasicInfoData>();
  const [VarientListData, setVarientListData] = useState<Variant[]>([]);
  const [ModifyItem, setModifyItem] = useState("");
  const [Update, setUpdate] = useState(false);
  const [ID, setID] = useState("");
  return (
    <>
      {showMessage && (
        <MessagePopUp
          message={showMessage}
          type={messageType}
          duration={3000}
          onClose={() => setShowMessage(null)}
        />
      )}
      {ModifyItem === "varient" && (
        <ModifyVarientForm
          values={VarientListData}
          isOpen={setModifyItem}
          onShowMessage={(msg, type) => {
            setShowMessage(msg);
            setMessageType(type);
            if (type === "success") setRefreshKey((prev) => prev + 1);
          }}
        />
      )}

      {ModifyItem === "basic" && ModfiyBasicInfoData && (
        <ModifyBasicInfo
          values={ModfiyBasicInfoData}
          isOpen={setModifyItem}
          onShowMessage={(msg, type) => {
            setShowMessage(msg);
            setMessageType(type);
            if (type === "success") setRefreshKey((prev) => prev + 1);
          }}
        />
      )}
      <div className="space-y-6">
        {/* Top Buttons */}
        <div className="w-full bg-gray-50 shadow-sm flex justify-between px-1 py-2 rounded-lg">
          <button
            onClick={() => {
              setView("list");
              //setCategorySubList(undefined);
              setUpdate(false);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition
                  ${view === "list" ? "bg-neutral-900 text-white" : "bg-white text-neutral-900 shadow hover:shadow-lg"}`}
          >
            <List size={18} />
            Show List
          </button>

          <button
            onClick={() => setView("form")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition
                  ${view === "form" ? "bg-neutral-900 text-white" : "bg-white text-neutral-900 shadow hover:shadow-lg"}`}
          >
            <Plus size={18} />
            Add New
          </button>
        </div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-neutral-900">
            Product Management
          </h1>
        </div>
        <div className="rounded-3xl bg-white/70 backdrop-blur-xl p-6 shadow-[0_20px_40px_rgba(0,0,0,0.07)] transition-all">
          {view === "form" && (
            <ProductAddForm
              onShowMessage={(msg, type) => {
                setShowMessage(msg);
                setMessageType(type);
                if (type === "success") setView("list");
              }}
            />
          )}
          {view === "list" && (
            <GetProductsFunctionForm
              productID={setID}
              refreshKey={refreshKey}
              values={setModifyItem}
              onModifyData={setModfiyBasicInfoData}
              onVarientData={setVarientListData}
              onShowMessage={(msg, type) => {
                setShowMessage(msg);
                setMessageType(type);
                if (type === "success") setView("list");
              }}
            />
          )}
        </div>
      </div>
    </>
  );
}
