import GetCountry from "@/api/lib/Admin/Country/countryGet";
import AddZoneApi from "@/api/lib/Admin/Shipment/City/CityAdd/CityAdd";
import ModifyCity from "@/api/lib/Admin/Shipment/City/ModifyCity/ModifyCity";
import GetRegionApi from "@/api/lib/Admin/Shipment/Region/getRegion";
import {
  Countryget,
  CountrygetApiResponse,
} from "@/api/types/Admin/Country/country";
import { zonelist } from "@/api/types/Admin/Shipment/City/City";
import {
  regionlist,
  responseRegionList,
} from "@/api/types/Admin/Shipment/Region/Region";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
interface AddTillFormProps {
  //countryList: Countryget[];
  Update: boolean;
  // TillID: string;
  onShowMessage: (message: string, type: "success" | "error") => void;
  initialData?: zonelist | null;
}

export default function AddCity({
  onShowMessage,
  Update,
  initialData,
}: AddTillFormProps) {
  const [loading, setLoading] = useState(false);
  const [ZoneName, setZoneName] = useState("");
  const [Countries, setCountries] = useState<Countryget[]>([]);
  const [RegionList, setRegionList] = useState<regionlist[]>([]);
  const [cityName, setCityName] = useState("");
  const [CountryID, setCountryID] = useState("");
  const [RegionID, setRegionID] = useState("");
  const [ZoneID, setZoneID] = useState("");
  const [cityList, setCityList] = useState();

  const getCountry = async () => {
    const token = localStorage.getItem("adminToken");
    const response = await GetCountry(String(token));
    if (response.status === 201 || response.status === 200) {
      const data = response.data as CountrygetApiResponse;
      setCountries(data.countryList);
    }
  };
  const getRegion = async (ID: string) => {
    const token = localStorage.getItem("adminToken");
    const response = await GetRegionApi(ID, String(token));
    const data = response.data as responseRegionList;
    setRegionList(data.regionlist);
    console.log(data.regionlist);
  };
  const addZone = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      const formData = {
        regionID: RegionID,
        zoneName: ZoneName,
      };
      const response = await AddZoneApi(formData, String(token));
      console.log(response);
      if (response.status === 200 || response.status === 201) {
        setZoneName("");
        onShowMessage(response.message || "Zone Added successfully", "success");
      }
    } catch (error) {
      onShowMessage("Something went wrong", "error");
      setLoading(true);
    } finally {
      setLoading(false);
    }
  };

  const modifyZone = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      const formData = {
        zoneID: ZoneID,
        regionID: RegionID,
        zoneName: ZoneName,
      };
      const response = await ModifyCity(formData, String(token));
      console.log(response);
      if (response.status === 200 || response.status === 201) {
        setZoneName("");
        onShowMessage(
          response.message || "Zone Modified successfully",
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
    console.log(Update);
    if (initialData) {
      setCountryID(initialData.countryID);
      getRegion(initialData.countryID);
      setRegionID(initialData.regionID);
      setZoneID(initialData.zoneID);
      setZoneName(initialData.zoneName);
    }
  }, [initialData]);
  useEffect(() => {
    getCountry();
  }, []);
  return (
    <>
      <div className="w-full flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:max-w-md space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Country
            </label>
            <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
              <select
                value={CountryID}
                name="CategoryMain"
                className="w-full bg-transparent outline-none text-gray-900 p-1"
                onChange={(e) => {
                  setCountryID(e.target.value);
                  getRegion(e.target.value);
                }}
              >
                <option>Select Country</option>
                {Countries.map((cat) => (
                  <option key={cat.countryID} value={cat.countryID}>
                    {cat.countryName}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Region
            </label>
            <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
              <select
                value={RegionID}
                name="CategoryMain"
                className="w-full bg-transparent outline-none text-gray-900 p-1"
                onChange={(e) => setRegionID(e.target.value)}
              >
                <option>Select Region</option>
                {RegionList.map((cat) => (
                  <option key={cat.regionID} value={cat.regionID}>
                    {cat.regionName}
                  </option>
                ))}
              </select>
            </div>
          </div>
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
          <div className="max-w-md space-y-4">
            {Update ? (
              <div className="flex justify-end">
                <button
                  onClick={modifyZone}
                  className="px-6 py-2 rounded-xl bg-neutral-900 text-white font-medium hover:bg-neutral-800 transition shadow-lg"
                >
                  {loading ? "Updating..." : "Update"}
                </button>
              </div>
            ) : (
              <div className="flex justify-end">
                <button
                  onClick={addZone}
                  className="px-6 py-2 rounded-xl bg-neutral-900 text-white font-medium hover:bg-neutral-800 transition shadow-lg"
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            )}
          </div>
        </div>
        {/* <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="py-3 px-4 text-sm text-neutral-500">#</th>
                <th className="py-3 px-4 text-sm text-neutral-500">
                  City Name
                </th>
                <th className="py-3 px-4 text-sm text-neutral-500">Action</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div> */}
      </div>
    </>
  );
}
