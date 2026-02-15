"use client";
import AddZone from "@/api/lib/Admin/Shipment/City/CityAdd/CityAdd";
import { useState } from "react";
interface AddTillFormProps {
  //   Update: boolean;
  //   TillID: string;
  onShowMessage: (message: string, type: "success" | "error") => void;
  //   initialData?: TillList | null;
}
export default function AddCityForm({
  onShowMessage,
  //   Update,
  //   initialData,
  //   TillID,
}: AddTillFormProps) {
  const [loading, setLoading] = useState(false);
  const [ZoneName, setZoneName] = useState("");

  const addZone = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      const formData = {
        zoneName: ZoneName,
      };
      const response = await AddZone(formData, String(token));
      if (response.status === 200 || response.status === 201) {
        setZoneName("");
        onShowMessage(response.message || "Till added successfully", "success");
      }
    } catch (error) {
      setLoading(true);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="max-w-md space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            City Name
          </label>
          <input
            type="text"
            value={ZoneName}
            onChange={(e) => setZoneName(e.target.value)}
            placeholder="Enter city name"
            className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none transition"
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={addZone}
            className="px-6 py-2 rounded-xl bg-neutral-900 text-white font-medium hover:bg-neutral-800 transition shadow-lg"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </>
  );
}
