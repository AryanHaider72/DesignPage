import GetCountry from "@/api/lib/Admin/Country/countryGet";
import ModifyRegionApi from "@/api/lib/Admin/Shipment/Region/Modifyregion";
import AddRegionApi from "@/api/lib/Admin/Shipment/Region/regionAdd";
import {
  Countryget,
  CountrygetApiResponse,
} from "@/api/types/Admin/Country/country";
import { regionlist } from "@/api/types/Admin/Shipment/Region/Region";
import { use, useEffect, useState } from "react";
interface AddTillFormProps {
  countryList: Countryget[];
  Update: boolean;
  TillID: string;
  onShowMessage: (message: string, type: "success" | "error") => void;
  initialData?: regionlist | null;
}
export default function AddRegion({
  countryList,
  onShowMessage,
  Update,
  initialData,
  TillID,
}: AddTillFormProps) {
  const [isLoading, setisLoading] = useState(false);
  const [countryID, setCountryID] = useState("");
  const [RegionName, setRegionName] = useState("");

  const [RegionID, setRegionID] = useState("");

  const addRegion = async () => {
    try {
      setisLoading(true);
      const token = localStorage.getItem("adminToken");
      const formData = {
        countryID: countryID,
        regionName: RegionName,
      };
      const response = await AddRegionApi(formData, String(token));
      if (response.status === 200) {
        onShowMessage(
          response.message || "Region Added successfully",
          "success",
        );
        setRegionName("");
        setCountryID("");
      } else {
        onShowMessage(response.message || "Something went wrong", "error");
      }
    } catch (err) {
      onShowMessage("Network error. Please try again.", "error");
    } finally {
      setisLoading(false);
    }
  };
  const ModifyRegion = async () => {
    try {
      setisLoading(true);
      const token = localStorage.getItem("adminToken");
      const formData = {
        regionID: RegionID,
        countryID: countryID,
        regionName: RegionName,
      };

      const response = await ModifyRegionApi(formData, String(token));
      if (response.status === 200) {
        onShowMessage(
          response.message || "Region Modified successfully",
          "success",
        );
        setRegionName("");
        setCountryID("");
      } else {
        onShowMessage(response.message || "Something went wrong", "error");
      }
    } catch (err) {
      onShowMessage("Network error. Please try again.", "error");
    } finally {
      setisLoading(false);
    }
  };
  useEffect(() => {
    console.log(Update);
    if (initialData) {
      setRegionID(initialData.regionID);
      setRegionName(initialData.regionName);
      setCountryID(TillID);
    }
  }, [initialData]);
  return (
    <>
      <div className="max-w-md space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Country
          </label>
          <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
            <select
              value={countryID}
              name="CategoryMain"
              className="w-full bg-transparent outline-none text-gray-900 p-1"
              onChange={(e) => setCountryID(e.target.value)}
            >
              <option>Select Country</option>
              {countryList.map((cat) => (
                <option key={cat.countryID} value={cat.countryID}>
                  {cat.countryName}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Region Name
          </label>
          <input
            type="text"
            value={RegionName}
            onChange={(e) => setRegionName(e.target.value)}
            placeholder="Enter region name"
            className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none transition"
          />
        </div>
        {Update ? (
          <div className="flex justify-end">
            <button
              onClick={ModifyRegion}
              className="px-6 py-2 rounded-xl bg-neutral-900 text-white font-medium hover:bg-neutral-800 transition shadow-lg"
            >
              {isLoading ? "Updating..." : "Update"}
            </button>
          </div>
        ) : (
          <div className="flex justify-end">
            <button
              onClick={addRegion}
              className="px-6 py-2 rounded-xl bg-neutral-900 text-white font-medium hover:bg-neutral-800 transition shadow-lg"
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
