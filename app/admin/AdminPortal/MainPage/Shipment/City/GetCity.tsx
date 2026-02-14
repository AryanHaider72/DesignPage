import GetCountry from "@/api/lib/Admin/Country/countryGet";
import DeleteCityApi from "@/api/lib/Admin/Shipment/City/DeleteCity/DeletCity";
import GetCityApi from "@/api/lib/Admin/Shipment/City/GetCity/GetCity";
import GetRegionApi from "@/api/lib/Admin/Shipment/Region/getRegion";
import {
  Countryget,
  CountrygetApiResponse,
} from "@/api/types/Admin/Country/country";
import {
  citylist,
  responseZoneList,
  zonelist,
} from "@/api/types/Admin/Shipment/City/City";
import {
  regionlist,
  responseRegionList,
} from "@/api/types/Admin/Shipment/Region/Region";
import DeleteComponent from "@/app/UsefullComponent/DeleteComponent/page";
import { Pencil, Trash } from "lucide-react";
import { useEffect, useState } from "react";
interface GetTillFormProps {
  onEdit: (till: zonelist, tillID: string) => void;
}
export default function GetCity({ onEdit }: GetTillFormProps) {
  const [loading, setLoading] = useState(false);
  const [ID, setID] = useState("");
  const [Delete, setDelete] = useState(false);
  const [CountryID, setCountryID] = useState("");
  const [RegionID, setRegionID] = useState("");
  const [Countries, setCountries] = useState<Countryget[]>([]);
  const [RegionList, setRegionList] = useState<regionlist[]>([]);
  const [cityList, setCityList] = useState<zonelist[]>([]);

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

  const getCityRecord = async (ID: string) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await GetCityApi(ID, String(token));
      const data = response.data as responseZoneList;
      console.log(response);
      setCityList(data.zonelist);
    } finally {
      setLoading(false);
    }
  };
  const deleteTill = async (ID: string) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      const formData = {
        zoneID: ID,
      };
      const response = await DeleteCityApi(formData, String(token));
      if (response.status === 200 || response.status === 201) {
        setDelete(false);
        setCityList(cityList.filter((item) => item.zoneID !== ID));
      } else {
      }
    } catch (error) {
      setLoading(true);
    } finally {
      setLoading(false);
    }
  };
  const fetchData = (ID: string) => {
    const data = cityList.find((item) => item.zoneID === ID);
    if (data) {
      onEdit(data, ID);
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
                getCityRecord(e.target.value);
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
        {cityList.map((item, idx) => (
          <div
            key={item.zoneID}
            className="flex items-center justify-between bg-white shadow-md rounded-lg p-4 hover:shadow-xl transition relative"
          >
            {/* Left: Till Info */}
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-gray-800">
                {item.zoneName}
              </span>
            </div>

            {/* Right: Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                className="flex items-center gap-1 px-2 py-1 text-sm font-medium text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition"
                onClick={() => fetchData(item.zoneID)}
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
      </div>
    </>
  );
}
