"use client";
import GetCountry from "@/api/lib/Admin/Country/countryGet";
import GetCityApi from "@/api/lib/Admin/Shipment/City/GetCity/GetCity";
import AddCityOriginApi from "@/api/lib/Admin/Shipment/OriginalCityAPi/addCity/AddCity";
import ModifyCityOriginApi from "@/api/lib/Admin/Shipment/OriginalCityAPi/ModifyCity/ModifyCity";
import GetRegionApi from "@/api/lib/Admin/Shipment/Region/getRegion";
import {
  responseZoneList,
  zonelist,
} from "@/api/types/Admin/Shipment/City/City";
import {
  Countryget,
  CountrygetApiResponse,
} from "@/api/types/Admin/Shipment/Country/Country";
import { zonelistOrigin } from "@/api/types/Admin/Shipment/OriginCity/City";
import {
  regionlist,
  responseRegionList,
} from "@/api/types/Admin/Shipment/Region/Region";
import { useEffect, useState } from "react";
interface AddTillFormProps {
  //countryList: Countryget[];
  Update: boolean;
  // TillID: string;
  onShowMessage: (message: string, type: "success" | "error") => void;
  initialData?: zonelistOrigin | null;
}
export default function AddCityForm({
  Update,
  onShowMessage,
  initialData,
}: AddTillFormProps) {
  const [loading, setLoading] = useState(false);
  const [Countries, setCountries] = useState<Countryget[]>([]);
  const [RegionList, setRegionList] = useState<regionlist[]>([]);
  const [cityList, setCityList] = useState<zonelist[]>([]);
  const [CountryID, setCountryID] = useState("");
  const [RegionID, setRegionID] = useState("");
  const [ZoneID, setZoneID] = useState("");
  const [ID, setID] = useState("");
  const [CityName, setCityName] = useState("");

  const getCountry = async () => {
    const token = localStorage.getItem("adminToken");
    const response = await GetCountry(String(token));
    if (response.status === 201 || response.status === 200) {
      const data = response.data as CountrygetApiResponse;
      setCountries(data.countryList);
      getRegion(data.countryList[0].countryID);
    }
  };
  const getRegion = async (ID: string) => {
    const token = localStorage.getItem("adminToken");
    const response = await GetRegionApi(ID, String(token));
    const data = response.data as responseRegionList;
    setRegionList(data.regionlist);
    getZone(data.regionlist[0].regionID);
  };
  const getZone = async (ID: string) => {
    const token = localStorage.getItem("adminToken");
    const response = await GetCityApi(ID, String(token));
    const data = response.data as responseZoneList;
    setCityList(data.zonelist);
  };

  const addCityTable = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      const formData = {
        cityName: CityName,
        zoneID: ZoneID,
      };
      const response = await AddCityOriginApi(formData, String(token));
      if (response.status === 200 || response.status === 201) {
        setCityName("");
        onShowMessage(response.message || "City Added successfully", "success");
      }
    } catch (error) {
      onShowMessage("Something went wrong", "error");
      setLoading(true);
    } finally {
      setLoading(false);
    }
  };
  const ModifyCityTable = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      const formData = {
        cityID: ID,
        cityName: CityName,
        zoneID: ZoneID,
      };
      const response = await ModifyCityOriginApi(formData, String(token));
      if (response.status === 200 || response.status === 201) {
        setCityName("");
        onShowMessage(
          response.message || "City Modified successfully",
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
    const loadData = async () => {
      if (initialData) {
        setCountryID(initialData.countryID);

        await getRegion(initialData.countryID);

        setRegionID(initialData.regionID);

        await getZone(initialData.regionID);

        setZoneID(initialData.zoneID);
        setCityName(initialData.cityName);
        setID(initialData.cityID);
      }
    };

    loadData();
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
                onChange={(e) => {
                  setRegionID(e.target.value);
                  getZone(e.target.value);
                }}
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
              Zone
            </label>
            <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
              <select
                value={ZoneID}
                name="CategoryMain"
                className="w-full bg-transparent outline-none text-gray-900 p-1"
                onChange={(e) => setZoneID(e.target.value)}
              >
                <option>Select Region</option>
                {cityList.map((cat) => (
                  <option key={cat.zoneID} value={cat.zoneID}>
                    {cat.zoneName}
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
              value={CityName}
              onChange={(e) => setCityName(e.target.value)}
              placeholder="Enter city name"
              className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none transition"
            />
          </div>
          <div className="max-w-md space-y-4">
            {Update ? (
              <div className="flex justify-end">
                <button
                  onClick={ModifyCityTable}
                  className="px-6 py-2 rounded-xl bg-neutral-900 text-white font-medium hover:bg-neutral-800 transition shadow-lg"
                >
                  {loading ? "Updating..." : "Update"}
                </button>
              </div>
            ) : (
              <div className="flex justify-end">
                <button
                  onClick={addCityTable}
                  className="px-6 py-2 rounded-xl bg-neutral-900 text-white font-medium hover:bg-neutral-800 transition shadow-lg"
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
