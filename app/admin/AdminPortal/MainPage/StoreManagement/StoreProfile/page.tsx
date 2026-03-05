"use client";
import { List, Plus } from "lucide-react";
import { useState } from "react";
import HeaderImageProfile from "./HeaderImageProfile";
import ImagesProfile from "./ImagesProfile";
import MessagePopUp from "@/app/UsefullComponent/MessagePopup/page";
import { StoreHomeGet } from "@/api/types/Admin/Store/StoreHomepageSetting/StoreHomepageSetting";

export default function StoreProfile() {
  const [ID, setID] = useState("");
  const [Update, setUpdate] = useState(false);
  const [view, setView] = useState<"list" | "form">("list");
  const [showMessage, setShowMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success",
  );
  const [DefaultStoreProductList, setDefaultStoreProductList] =
    useState<StoreHomeGet>();

  // Reset form data when switching to form view
  const handleAddNew = () => {
    setView("form");
    setUpdate(false);
    setDefaultStoreProductList(undefined); // Clear the data
    setID(""); // Reset the store ID
  };

  const handleEditStore = (data: StoreHomeGet) => {
    setDefaultStoreProductList(data);
    setView("form");
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
              setDefaultStoreProductList(undefined);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition
            ${view === "list" ? "bg-neutral-900 text-white" : "bg-white text-neutral-900 shadow hover:shadow-lg"}`}
          >
            <List size={18} />
            Show List
          </button>

          <button
            onClick={handleAddNew}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition
            ${view === "form" && !Update ? "bg-neutral-900 text-white" : "bg-white text-neutral-900 shadow hover:shadow-lg"}`}
          >
            <Plus size={18} />
            Add New
          </button>
        </div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-neutral-900">
            Store Profile
          </h1>
        </div>
        <div className="rounded-3xl bg-white/70 backdrop-blur-xl p-6 shadow-[0_20px_40px_rgba(0,0,0,0.07)] transition-all">
          {view === "form" && (
            <HeaderImageProfile
              key={view === "form" && !Update ? "new-form" : "edit-form"} // Add key to force re-render
              initalData={DefaultStoreProductList}
              storeID={ID}
              updateData={Update}
              onShowMessage={(msg, type) => {
                setShowMessage(msg);
                setMessageType(type);
                if (type === "success") setView("list");
              }}
            />
          )}
          {view === "list" && (
            <ImagesProfile
              initalData={handleEditStore}
              storeID={setID}
              updateData={setUpdate}
            />
          )}
        </div>
      </div>
    </>
  );
}
