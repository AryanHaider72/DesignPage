"use client";
import { List, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import AddSaleForm from "./AddSaleForm";
import AddReturnItemtoSaleform from "./AddReturnItem/page";
import MessagePopUp from "@/app/UsefullComponent/MessagePopup/page";
import GetSaleReturnForm from "./getSaleReturnForm";

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

export default function SaleReturnFormMain() {
  const [isOpenReturn, setisOpenReturn] = useState(false);
  const [newItem, setNewItem] = useState<newItem[]>([]);
  const [showMessage, setShowMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success",
  );
  const [resetList, setResetList] = useState(false);
  const [view, setView] = useState<"list" | "form">("list");

  const [removeID, setremoveID] = useState("");
  const handleRemoveItem = (id: string) => {
    setNewItem((prev) => prev.filter((item) => item.attributeID !== id));
  };
  useEffect(() => {
    if (resetList) {
      setNewItem([]);
    }
  }, [resetList]);

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
      {isOpenReturn && (
        <>
          <AddReturnItemtoSaleform
            isOpenReturn={setisOpenReturn}
            addItemsList={setNewItem}
            removeItem={removeID}
          />
        </>
      )}
      <div className="space-y-6">
        {/* Top Buttons */}
        <div className="w-full bg-gray-50 shadow-sm flex justify-between px-1 py-2 rounded-lg">
          <button
            onClick={() => {
              setView("list");
              //setUpdate(false);
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
            Sale Return Management
          </h1>
        </div>
        <div className="rounded-3xl bg-white/70 backdrop-blur-xl p-6 shadow-[0_20px_40px_rgba(0,0,0,0.07)] transition-all">
          {view === "form" && (
            <AddSaleForm
              isOpenReturn={setisOpenReturn}
              exchangeItems={newItem}
              removeItem={handleRemoveItem}
              handleResetNewItem={setResetList}
              onShowMessage={(msg, type) => {
                setShowMessage(msg);
                setMessageType(type);
                if (type === "success") setView("list");
              }}
            />
          )}
          {view === "list" && <GetSaleReturnForm />}
        </div>
      </div>
    </>
  );
}
