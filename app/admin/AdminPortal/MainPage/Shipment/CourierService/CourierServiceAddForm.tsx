"use client";
import AddCourierApi from "@/api/lib/Admin/Shipment/Courier/AddCourier/AddCourier";
import ModifyCourierApi from "@/api/lib/Admin/Shipment/Courier/ModifyCourier/ModifyCourier";
import GetDelieveryStandardApi from "@/api/lib/Admin/Shipment/Delievry/GetDelievryStandard/GetDelievryStandard";
import { CourierList } from "@/api/types/Admin/Shipment/Couriere/Couriere";
import {
  DelievryGetData,
  ResponseDelievryGetData,
} from "@/api/types/Admin/Shipment/Delievry/Delievry";
import { useEffect, useState } from "react";

interface AddTillFormProps {
  //countryList: Countryget[];
  Update: boolean;
  // TillID: string;
  onShowMessage: (message: string, type: "success" | "error") => void;
  initialData?: CourierList | null;
}
export default function CourierServiceAddForm({
  Update,
  onShowMessage,
  initialData,
}: AddTillFormProps) {
  const [loading, setLoading] = useState(false);
  const [ServiceName, setServiceName] = useState("");
  const [Description, setDescription] = useState("");
  const [PhoneNo, setPhoneNo] = useState("");
  const [Email, setEmail] = useState("");
  const [OpeningBalance, setOpeningBalance] = useState("");
  const [ID, setID] = useState("");
  const [DeliveryTypeID, setDeliveryTypeID] = useState("");
  const [delieveryGet, setDelieveryGet] = useState<DelievryGetData[]>([]);

  const getDelieveryStandard = async () => {
    const token = localStorage.getItem("adminToken");
    const response = await GetDelieveryStandardApi(String(token));
    const data = response.data as ResponseDelievryGetData;
    setDelieveryGet(data.delievryData);
  };
  const addservice = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      const formData = {
        serviceName: ServiceName,
        phoneNo: PhoneNo,
        email: Email,
        description: Description,
        openingBalance: 0,
        deliveryTypeID: DeliveryTypeID,
      };
      const response = await AddCourierApi(formData, String(token));
      if (response.status === 200 || response.status === 201) {
        setServiceName("");
        setDescription("");
        setOpeningBalance("");
        setEmail("");
        setOpeningBalance("");
        onShowMessage(
          response.message || "Service Added successfully",
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
  const Modifyservice = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      const formData = {
        courierID: ID,
        serviceName: ServiceName,
        phoneNo: PhoneNo,
        email: Email,
        description: Description,
        openingBalance: 0,
        deliveryTypeID: DeliveryTypeID,
      };
      const response = await ModifyCourierApi(formData, String(token));
      if (response.status === 200 || response.status === 201) {
        setServiceName("");
        setDescription("");
        setOpeningBalance("");
        setEmail("");
        setOpeningBalance("");
        onShowMessage(
          response.message || "Service Modified successfully",
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
      setID(initialData.courierID);
      setDescription(initialData.description);
      setEmail(initialData.email);
      setPhoneNo(initialData.phoneNo);
      setServiceName(initialData.serviceName);
      setDeliveryTypeID(initialData.deliveryTypeID);
    }
  }, [initialData]);

  useEffect(() => {
    getDelieveryStandard();
  }, []);
  return (
    <>
      <div className="w-full flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:max-w-md space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Delievry Standard
            </label>
            <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
              <select
                value={DeliveryTypeID}
                name="CategoryMain"
                className="w-full bg-transparent outline-none text-gray-900 p-1"
                onChange={(e) => {
                  setDeliveryTypeID(e.target.value);
                }}
              >
                <option>Select Delievry</option>
                {delieveryGet.map((cat) => (
                  <option key={cat.deliveryTypeID} value={cat.deliveryTypeID}>
                    {cat.typeName}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Service Name
            </label>
            <input
              type="text"
              value={ServiceName}
              onChange={(e) => setServiceName(e.target.value)}
              placeholder="Enter Service Name"
              className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Phone No
            </label>
            <input
              type="text"
              value={PhoneNo}
              onChange={(e) => setPhoneNo(e.target.value)}
              placeholder="Enter Phone No"
              className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Email
            </label>
            <input
              type="text"
              value={Email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Email"
              className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none transition"
            />
          </div>
          {/* <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Opening Balance
            </label>
            <input
              type="number"
              value={OpeningBalance}
              onChange={(e) => setOpeningBalance(e.target.value)}
              placeholder="Enter Opening Balance"
              className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none transition"
            />
          </div> */}
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
          <div className="max-w-md space-y-4">
            {Update ? (
              <div className="flex justify-end">
                <button
                  onClick={Modifyservice}
                  className="px-6 py-2 rounded-xl bg-neutral-900 text-white font-medium hover:bg-neutral-800 transition shadow-lg"
                >
                  {loading ? "Updating..." : "Update"}
                </button>
              </div>
            ) : (
              <div className="flex justify-end">
                <button
                  onClick={addservice}
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
