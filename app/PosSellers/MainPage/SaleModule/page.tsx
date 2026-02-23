"use client";
import MessagePopUp from "@/app/UsefullComponent/MessagePopup/page";
import { List, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import PosSaleAddForm from "./PosSaleAddForm";
import ShowReturnItemsList from "./ShowReturnListItem/page";
import GetProductVarient from "@/api/lib/PosIntegration/ProductSalesMan/FetchProductVarient/FetchProductVarinet";
import { varinetMessage } from "@/api/types/Posintegration/Product/ProductGet";

interface newItem {
  attributeID: string;
  productName: string;
  qty: number;
  varientValue: string;
  price: number;
  barcode: string;
  stockQty: number;
  discount: number;
}
interface VarintList {
  productName: string;
  varientID: string;
  variantName: string;
  discount: number;
  variantValues: variantValues[];
}
interface variantValues {
  attributeID: string;
  varientValue: string;
  costPrice: number;
  salePrice: number;
  qty: number;
  barcode: string;
}
export default function PosSaleModule() {
  //const [ExpenseList, setExpenseList] = useState<ExpenseData>();
  const [showReturnList, setShowReturnList] = useState(false);
  const [showMessage, setShowMessage] = useState<string | null>(null);
  const [Update, setUpdate] = useState(false);
  const [newItem, setNewItem] = useState<newItem[]>([]);
  const [productID, setProductID] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success",
  );
  const [view, setView] = useState<"list" | "form">("list");
  const [VarintListInPopUp, setVarintListInPopUp] = useState<VarintList[]>([]);

  useEffect(() => {
    if (productID) {
      varinetList(productID);
    }
  }, [productID]);
  const varinetList = async (ID: string) => {
    const token = localStorage.getItem("posSellerToken");
    const response = await GetProductVarient(String(token), ID);
    if (response.status === 200 || response.status === 201) {
      const data = response.data as varinetMessage;
      console.log(data);
      setVarintListInPopUp(data.variants);
    }
  };

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
      <div className="space-y-6">
        {/* Top Buttons */}
        <div className="w-full bg-gray-50 shadow-sm flex justify-between px-1 py-2 rounded-lg">
          <button
            onClick={() => {
              setView("list");
              setUpdate(false);
              //setExpenseList(undefined);
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
            Sale Management
          </h1>
        </div>
        {showReturnList && (
          <div className="fixed inset-0 w-full  h-screen flex items-center justify-center bg-black/50 backdrop-blur-sm z-100">
            <div className="bg-white  rounded-2xl shadow-lg p-6 w-full max-w-4xl ">
              <ShowReturnItemsList
                onToggleReturnList={setShowReturnList}
                onAddReturnItem={(item) =>
                  setNewItem((prev) => [...prev, item])
                }
              />
            </div>
          </div>
        )}
        <div className="rounded-3xl bg-white/70 backdrop-blur-xl p-6 shadow-[0_20px_40px_rgba(0,0,0,0.07)] transition-all">
          {view === "form" && (
            <PosSaleAddForm
              onToggleReturnList={setShowReturnList}
              returnItemData={newItem}
              onToggleProductID={setProductID}
            />
          )}
        </div>
      </div>
    </>
  );
}
