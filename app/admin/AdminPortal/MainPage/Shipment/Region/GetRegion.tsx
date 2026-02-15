import DeleteRegion from "@/api/lib/Admin/Shipment/Region/DeleteRegion";
import GetRegionApi from "@/api/lib/Admin/Shipment/Region/getRegion";
import { Countryget } from "@/api/types/Admin/Country/country";
import {
  regionlist,
  responseRegionList,
} from "@/api/types/Admin/Shipment/Region/Region";
import DeleteComponent from "@/app/UsefullComponent/DeleteComponent/page";
import Spinner from "@/app/UsefullComponent/Spinner/page";
import { Pencil, Trash } from "lucide-react";
import { useEffect, useState } from "react";
interface AddTillFormProps {
  countryList: Countryget[];
  onEdit: (region: regionlist, regionID: string) => void;
}
export default function GetRegion({ countryList, onEdit }: AddTillFormProps) {
  const [countryID, setCountryID] = useState("");
  const [loading, setLoading] = useState(false);
  const [RegionList, setRegionList] = useState<regionlist[]>([]);
  const [ID, setID] = useState("");
  const [Delete, setDelete] = useState(false);

  const getRegion = async (ID: string) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      const response = await GetRegionApi(ID, String(token));
      const data = response.data as responseRegionList;
      setRegionList(data.regionlist);
      console.log(data.regionlist);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const fetchData = (ID: string) => {
    const data = RegionList.find((item) => item.regionID === ID);
    if (data) {
      onEdit(data, countryID);
    }
  };

  const deleteRegion = async (ID: string) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      const formData = {
        regionID: ID,
      };
      const response = await DeleteRegion(formData, String(token));
      setDelete(false);
      setRegionList(RegionList.filter((item) => item.regionID !== ID));
      setID("");
    } catch {
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      {Delete && (
        <DeleteComponent
          onCancel={() => {
            setDelete(false);
            setID("");
          }}
          onConfirm={() => deleteRegion(ID)}
        />
      )}
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">
          Country
        </label>
        <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
          <select
            value={countryID}
            name="CategoryMain"
            className="w-full bg-transparent outline-none text-gray-900 p-1"
            onChange={(e) => {
              const value = e.target.value;
              setCountryID(value);
              getRegion(value);
            }}
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
      {loading ? (
        <div className="flex justify-center py-10">
          <Spinner />
        </div>
      ) : (
        <div className="space-y-4">
          {RegionList.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between bg-white shadow-md rounded-lg p-4 hover:shadow-xl transition relative"
            >
              {/* Left: Till Info */}
              <div className="flex flex-col">
                <span className="text-lg font-semibold text-gray-800">
                  {item.regionName}
                </span>
              </div>

              {/* Right: Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  className="flex items-center gap-1 px-2 py-1 text-sm font-medium text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition"
                  onClick={() => fetchData(item.regionID)}
                >
                  <Pencil />
                </button>

                <button
                  onClick={() => {
                    setDelete(true);
                    setID(item.regionID);
                  }}
                  className="flex items-center gap-1 px-2 py-1 text-sm font-medium text-red-600 border border-red-600 rounded hover:bg-red-50 transition"
                >
                  <Trash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
