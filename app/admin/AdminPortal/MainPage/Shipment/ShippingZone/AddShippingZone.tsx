import GetRegionApi from "@/api/lib/Admin/Shipment/Region/getRegion";
import { Countryget } from "@/api/types/Admin/Country/country";
import {
  regionlist,
  responseRegionList,
} from "@/api/types/Admin/Shipment/Region/Region";
import { useEffect, useState } from "react";
interface AddTillFormProps {
  countryList: Countryget[];
  // Update: boolean;
  // TillID: string;
  // onShowMessage: (message: string, type: "success" | "error") => void;
  // initialData?: regionlist | null;
}
export default function AddShippingZone({ countryList }: AddTillFormProps) {
  const [countryID, setCountryID] = useState("");
  const [RegionList, setRegionList] = useState<regionlist[]>([]);

  return (
    <>
      <div className="max-w-md space-y-4">
        {/* <div>
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
          <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
            <select
              value={RegionName}
              name="CategoryMain"
              className="w-full bg-transparent outline-none text-gray-900 p-1"
              onChange={(e) => setRegionName(e.target.value)}
            >
              {Region.map((cat) => (
                <option key={cat.regionID} value={cat.regionID}>
                  {cat.regionName}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Zone Name
          </label>
          <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
            <select
              value={CityName}
              name="CategoryMain"
              className="w-full bg-transparent outline-none text-gray-900 p-1"
              onChange={(e) => setCityName(e.target.value)}
            >
              {cities.map((cat, index) => (
                <option key={index} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div> */}
        <div className="flex justify-end">
          <button className="px-6 py-2 rounded-xl bg-neutral-900 text-white font-medium hover:bg-neutral-800 transition shadow-lg">
            Save
          </button>
        </div>
      </div>
    </>
  );
}
