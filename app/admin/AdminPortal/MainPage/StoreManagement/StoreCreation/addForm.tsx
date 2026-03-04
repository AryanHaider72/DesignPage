"use client";
import GetCityApi from "@/api/lib/Admin/Shipment/City/GetCity/GetCity";
import { useEffect, useState } from "react";
import GetCountry from "@/api/lib/Admin/Country/countryGet";
import GetRegionApi from "@/api/lib/Admin/Shipment/Region/getRegion";
import {
  regionlist,
  responseRegionList,
} from "@/api/types/Admin/Shipment/Region/Region";
import StoreCreation from "@/api/lib/Admin/Stores/CreateStore/CreateStore";
import {
  Countryget,
  CountrygetApiResponse,
} from "@/api/types/Admin/Shipment/Country/Country";

interface response {
  message: string;
  zonelist: zonelist[];
}
interface zonelist {
  countryID: string;
  countryName: string;
  regionID: string;
  regionName: string;
  zoneID: string;
  zoneName: string;
}

export default function AddStoreForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [ZoneID, setZoneID] = useState("");
  const [StoreName, setStoreName] = useState("");
  const [StoreDescription, setStoreDescription] = useState("");
  const [Countries, setCountries] = useState<Countryget[]>([]);
  const [RegionList, setRegionList] = useState<regionlist[]>([]);
  const [RegionID, setRegionID] = useState("");
  const [countryID, setCountryID] = useState("");

  const [zonelist, setZoneList] = useState<zonelist[]>([]);

  const getCountry = async () => {
    const token = localStorage.getItem("adminToken");
    const response = await GetCountry(String(token));
    if (response.status === 201 || response.status === 200) {
      const data = response.data as CountrygetApiResponse;
      setCountries(data.countryList);
      setCountryID(data.countryList[0].countryID);
      getRegion(data.countryList[0].countryID);
    } else if (response.status === 401) return; //router.push("/sellerlogin");
  };
  const getRegion = async (ID: string) => {
    const token = localStorage.getItem("adminToken");
    const response = await GetRegionApi(ID, String(token));
    if (response.status === 200 || response.status === 201) {
      const data = response.data as responseRegionList;
      setRegionList(data.regionlist);
      setRegionID(data.regionlist[0].regionID);
      getZone(data.regionlist[0].regionID);
    } else {
      setRegionList([]);
    }
  };
  const getZone = async (ID: string) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await GetCityApi(ID, String(token));
      if (response.status === 200 || response.status === 201) {
        const data = response.data as response;
        setZoneList(data.zonelist);
        setZoneID(data.zonelist[0].zoneID);
      } else {
        setZoneList([]);
      }
    } catch {}
  };
  const createStore = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("adminToken");
      const email = localStorage.getItem("adminEmail") || "";
      const formData = {
        email: email,
        cityID: ZoneID,
        storeName: StoreName,
        description: StoreDescription,
      };
      const response = await StoreCreation(formData, String(token));
      if (response.status === 200 || response.status === 201) {
        console.log(response);
        //storesget();
        // setStoreShow(true);
        // setaddStoreForm(false);
        setStoreName("");
        setStoreDescription("");
        // setResponseBack(1);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCountry();
  }, []);
  return (
    <>
      <div className="w-full flex flex-col lg:flex-row gap-8">
        {/* FORM */}
        <div className="w-full lg:max-w-md space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Country
            </label>
            <select
              value={countryID}
              onChange={(e) => {
                setCountryID(e.target.value);
                getRegion(e.target.value);
              }}
              className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none transition"
            >
              {Countries.length === 0 ? (
                <option> No Countries Found</option>
              ) : (
                <>
                  {Countries.map((item) => (
                    <option key={item.countryID} value={item.countryID}>
                      {item.countryName}
                    </option>
                  ))}
                </>
              )}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Region
            </label>
            <select
              value={RegionID}
              onChange={(e) => {
                setRegionID(e.target.value);
                getZone(e.target.value);
              }}
              className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none transition"
            >
              {RegionList.length === 0 ? (
                <option> No Region Found</option>
              ) : (
                <>
                  {RegionList.map((item) => (
                    <option key={item.regionID} value={item.regionID}>
                      {item.regionName}
                    </option>
                  ))}
                </>
              )}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Zone
            </label>
            <select
              value={ZoneID}
              onChange={(e) => {
                setZoneID(e.target.value);
                // getZone(e.target.value);
              }}
              className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none transition"
            >
              {zonelist.length === 0 ? (
                <option> No Zone Found</option>
              ) : (
                <>
                  {zonelist.map((item) => (
                    <option key={item.zoneID} value={item.zoneID}>
                      {item.zoneName}
                    </option>
                  ))}
                </>
              )}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Store Name
            </label>
            <input
              type="text"
              value={StoreName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none transition"
              placeholder="Store Name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Description
            </label>
            <textarea
              value={StoreDescription}
              onChange={(e) => setStoreDescription(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none transition"
              placeholder="Description"
            />
          </div>
          <div className="flex justify-end">
            <button
              onClick={createStore}
              className="px-6 py-2 rounded-xl bg-neutral-900 text-white font-medium hover:bg-neutral-800 transition shadow-lg"
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
