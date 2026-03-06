"use client";
import GetCountry from "@/api/lib/Admin/Country/countryGet";
import GetCityApi from "@/api/lib/Admin/Shipment/City/GetCity/GetCity";
import DeleteCityOriginApi from "@/api/lib/Admin/Shipment/OriginalCityAPi/DeleteCity/DeleteCity";
import GetCityOriginApi from "@/api/lib/Admin/Shipment/OriginalCityAPi/GetCity/GetCity";
import GetRegionApi from "@/api/lib/Admin/Shipment/Region/getRegion";
import {
  responseZoneList,
  zonelist,
} from "@/api/types/Admin/Shipment/City/City";
import {
  Countryget,
  CountrygetApiResponse,
} from "@/api/types/Admin/Shipment/Country/Country";
import {
  responseCityOrigin,
  zonelistOrigin,
} from "@/api/types/Admin/Shipment/OriginCity/City";
import {
  regionlist,
  responseRegionList,
} from "@/api/types/Admin/Shipment/Region/Region";
import DeleteComponent from "@/app/UsefullComponent/DeleteComponent/page";
import Spinner from "@/app/UsefullComponent/Spinner/page";
import { Pencil, Trash } from "lucide-react";
import { useEffect, useState } from "react";
interface GetTillFormProps {
  onEdit: (till: zonelistOrigin) => void;
}
export default function GetCityList({ onEdit }: GetTillFormProps) {
  const [ID, setID] = useState("");
  const [Delete, setDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [CountryID, setCountryID] = useState("");
  const [RegionID, setRegionID] = useState("");
  const [ZoneID, setZoneID] = useState("");
  const [Countries, setCountries] = useState<Countryget[]>([]);
  const [RegionList, setRegionList] = useState<regionlist[]>([]);
  const [cityList, setCityList] = useState<zonelist[]>([]);
  const [cityOriginList, setCityOriginList] = useState<zonelistOrigin[]>([]);

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
  };
  const getZone = async (ID: string) => {
    const token = localStorage.getItem("adminToken");
    const response = await GetCityApi(ID, String(token));
    const data = response.data as responseZoneList;
    setCityList(data.zonelist);
  };
  const getCity = async (ID: string) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      const response = await GetCityOriginApi(String(token), ID);
      const data = response.data as responseCityOrigin;
      setCityOriginList(data.zonelist);
    } finally {
      setLoading(false);
    }
  };
  const fetchData = (ID: string) => {
    const data = cityOriginList.find((item) => item.cityID === ID);
    if (data) {
      onEdit(data);
    }
  };
  const deleteTill = async (ID: string) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      const formData = {
        cityID: ID,
      };
      const response = await DeleteCityOriginApi(String(token), formData);
      if (response.status === 200 || response.status === 201) {
        setDelete(false);
        setCityOriginList(cityOriginList.filter((item) => item.cityID !== ID));
      } else {
      }
    } catch (error) {
      setLoading(true);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getCountry();
  }, []);
  return (
    <>
      {Delete && (
        <DeleteComponent
          onCancel={() => {
            setDelete(false);
            setID("");
          }}
          onConfirm={() => deleteTill(ID)}
        />
      )}
      <div className="space-y-4">
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
              onChange={(e) => {
                setZoneID(e.target.value);
                getCity(e.target.value);
              }}
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
        {loading ? (
          <Spinner />
        ) : (
          <>
            {cityOriginList.length > 0 ? (
              <>
                {cityOriginList.map((item, idx) => (
                  <div
                    key={item.cityID}
                    className="flex items-center justify-between bg-white shadow-md rounded-lg p-4 hover:shadow-xl transition relative"
                  >
                    {/* Left: Till Info */}
                    <div className="flex flex-col">
                      <span className="text-lg font-semibold text-gray-800">
                        {item.cityName}
                      </span>
                    </div>

                    {/* Right: Action Buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        className="flex items-center gap-1 px-2 py-1 text-sm font-medium text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition"
                        onClick={() => fetchData(item.cityID)}
                      >
                        <Pencil />
                      </button>

                      <button
                        onClick={() => {
                          setDelete(true);
                          setID(item.zoneID);
                        }}
                        className="flex items-center gap-1 px-2 py-1 text-sm font-medium text-red-600 border border-red-600 rounded hover:bg-red-50 transition"
                      >
                        <Trash />
                      </button>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <p>No Record Found</p>
            )}
          </>
        )}
      </div>
    </>
  );
}
