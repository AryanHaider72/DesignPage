"use client";
import AddDelievryStandard from "@/api/lib/Admin/Shipment/Delievry/AddDelievryStandard/AddDelievryStandard";
import ModifyDelievryStandard from "@/api/lib/Admin/Shipment/Delievry/ModifyDelievryStandard/ModifyDelievryStandard";
import { DelievryGetData } from "@/api/types/Admin/Shipment/Delievry/Delievry";
import { useEffect, useState } from "react";
interface AddTillFormProps {
  Update: boolean;
  onShowMessage: (message: string, type: "success" | "error") => void;
  initialData?: DelievryGetData | null;
}
export default function DeleiveryStandardAddForm({
  onShowMessage,
  Update,
  initialData,
}: AddTillFormProps) {
  const [loading, setLoading] = useState(false);
  const [StandardName, setStandardName] = useState("");
  const [NumberOfDays, setNumberOfDays] = useState("");
  const [Description, setDescription] = useState("");
  const [ID, setID] = useState("");

  const addDelievryStandard = async () => {
    try {
      setLoading(true);
      const formData = {
        StandardName: StandardName,
        NumberOfDays: NumberOfDays,
        Description: Description,
      };
      const token = localStorage.getItem("adminToken");
      const response = await AddDelievryStandard(formData, String(token));
      if (response.status === 200 || response.status === 201) {
        setStandardName("");
        setNumberOfDays("");
        setDescription("");
        onShowMessage(
          response.message || "Standard Added successfully",
          "success",
        );
      }
    } catch (error) {
      onShowMessage("Something went wrong", "error");
      setLoading(true);
    } finally {
      setLoading(false);
    }
  };
  const updateDelievryStandard = async () => {
    try {
      setLoading(true);
      const formData = {
        deliveryTypeID: ID,
        StandardName: StandardName,
        NumberOfDays: NumberOfDays,
        Description: Description,
      };
      const token = localStorage.getItem("adminToken");
      const response = await ModifyDelievryStandard(formData, String(token));
      if (response.status === 200 || response.status === 201) {
        setStandardName("");
        setNumberOfDays("");
        setDescription("");
        onShowMessage(
          response.message || "Standard Modified successfully",
          "success",
        );
      }
    } catch (error) {
      onShowMessage("Something went wrong", "error");
      setLoading(true);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (initialData) {
      setID(initialData.deliveryTypeID);
      setDescription(initialData.description);
      setNumberOfDays(String(initialData.numberofDays));
      setStandardName(initialData.typeName);
    }
  }, [initialData]);
  return (
    <>
      <div className="w-full flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:max-w-md space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Standard Name
            </label>
            <input
              type="text"
              value={StandardName}
              onChange={(e) => setStandardName(e.target.value)}
              placeholder="Enter Standard Name"
              className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Number of Days
            </label>
            <input
              type="text"
              value={NumberOfDays}
              onChange={(e) => setNumberOfDays(e.target.value)}
              placeholder="Enter Number of Days"
              className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Description
            </label>
            <textarea
              value={Description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter Description"
              className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none transition"
            />
          </div>
          {Update ? (
            <div className="flex justify-end">
              <button
                onClick={updateDelievryStandard}
                className="px-6 py-2 rounded-xl bg-neutral-900 text-white font-medium hover:bg-neutral-800 transition shadow-lg"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          ) : (
            <div className="flex justify-end">
              <button
                onClick={addDelievryStandard}
                className="px-6 py-2 rounded-xl bg-neutral-900 text-white font-medium hover:bg-neutral-800 transition shadow-lg"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
