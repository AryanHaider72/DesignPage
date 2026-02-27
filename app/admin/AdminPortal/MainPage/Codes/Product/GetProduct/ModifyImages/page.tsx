"use client";
import { List, Plus, X } from "lucide-react";
import { useState } from "react";
import GetIMagesFormForMain from "./GetImages";
import AddImagesForm from "./AddIMages";
import MessagePopUp from "@/app/UsefullComponent/MessagePopup/page";
interface PassModifyBasicInfo {
  values: string;
  isOpen: (isOpen: string) => void;
  onShowMessage: (message: any, type: "success" | "error") => void;
}
export default function ModifyImagesMainForm({
  values,
  isOpen,
  onShowMessage,
}: PassModifyBasicInfo) {
  const [view, setView] = useState<"list" | "form">("list");
  const [showMessage, setShowMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success",
  );
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

          <div className="space-y-6">
            {/* Top Buttons */}
            <div className="w-full bg-gray-50 shadow-sm flex justify-between px-1 py-2 rounded-lg">
              <button
                onClick={() => {
                  setView("list");
                  //setCategorySubList(undefined);
                  //setUpdate(false);
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
              <h1 className="text-xl font-semibold text-neutral-900">
                Image Management
              </h1>
            </div>
            <div className="rounded-3xl bg-white/70 backdrop-blur-xl p-6 shadow-[0_20px_40px_rgba(0,0,0,0.07)] transition-all">
              {view === "list" && <GetIMagesFormForMain value={values} />}
              {view === "form" && (
                <AddImagesForm
                  values={values}
                  onShowMessage={(msg, type) => {
                    setShowMessage(msg);
                    setMessageType(type);
                    if (type === "success") isOpen("");
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
