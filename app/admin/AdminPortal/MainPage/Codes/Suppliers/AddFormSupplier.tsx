"use client";
import AddSupplierApi from "@/api/lib/Admin/Codes/Supplier/AddSupplier/AddSupplier";
import ModifySupplierApi from "@/api/lib/Admin/Codes/Supplier/ModifySupplier/ModifySupplier";
import { SupplierData } from "@/api/types/Admin/Codes/Supplier/Supplier";
import { useEffect, useState } from "react";

interface AddExpenseProps {
  initialData?: SupplierData | null;
  Update: boolean;
  onShowMessage: (message: any, type: "success" | "error") => void;
}

export default function AddSupplierForm({
  initialData,
  Update,
  onShowMessage,
}: AddExpenseProps) {
  const [loading, setLoading] = useState(false);
  const [SupplierName, setSupplierName] = useState("");
  const [PhoneNo, setPhoneNo] = useState("");
  const [Email, setEmail] = useState("");
  const [Address, setAddress] = useState("");
  const [OpeningBalance, setOpeningBalance] = useState("");
  const [Description, setDescription] = useState("");
  const [ID, setID] = useState("");

  const AddSupplierData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      const formData = {
        supplierName: SupplierName,
        phoneNo: PhoneNo,
        email: Email,
        description: Description,
        openingBalance: Number(OpeningBalance),
        address: Address,
      };
      const response = await AddSupplierApi(formData, String(token));
      if (response.status === 200) {
        setSupplierName("");
        setPhoneNo("");
        setAddress("");
        setOpeningBalance("");
        setDescription("");
        setEmail("");
        onShowMessage(
          response.message || "Customer Added successfully",
          "success",
        );
      } else {
        onShowMessage(response.message, "error");
      }
    } finally {
      setLoading(false);
    }
  };
  const ModifySupplierData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      const formData = {
        supplierID: ID,
        supplierName: SupplierName,
        phoneNo: PhoneNo,
        email: Email,
        description: Description,
        openingBalance: Number(OpeningBalance),
        address: Address,
      };
      const response = await ModifySupplierApi(formData, String(token));
      if (response.status === 200) {
        setSupplierName("");
        setPhoneNo("");
        setAddress("");
        setOpeningBalance("");
        setDescription("");
        setEmail("");
        setID("");
        onShowMessage(
          response.message || "Supplier Modified successfully",
          "success",
        );
      } else {
        onShowMessage(response.message, "error");
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (initialData) {
      setSupplierName(initialData.supplierName);
      setPhoneNo(initialData.phoneNo);
      setAddress(initialData.address);
      setOpeningBalance(String(initialData.remainingBalance));
      setDescription(initialData.description);
      setEmail(initialData.email);
      setID(initialData.supplierID);
    }
  }, [initialData]);
  return (
    <>
      <div className="w-full flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:max-w-md space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Supplier Name
            </label>
            <input
              type="text"
              value={SupplierName}
              onChange={(e) => setSupplierName(e.target.value)}
              placeholder="Enter Supplier Name"
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
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Address
            </label>
            <input
              type="text"
              value={Address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter Address"
              className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Opening Balance
            </label>
            <input
              type="text"
              value={OpeningBalance}
              onChange={(e) => setOpeningBalance(e.target.value)}
              placeholder="Enter Opening Balance"
              className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none transition"
            />
          </div>
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
          {Update ? (
            <div className="flex justify-end">
              <button
                onClick={ModifySupplierData}
                className="px-6 py-2 rounded-xl bg-neutral-900 text-white font-medium hover:bg-neutral-800 transition shadow-lg"
              >
                {loading ? "Updating..." : "Update"}
              </button>
            </div>
          ) : (
            <div className="flex justify-end">
              <button
                onClick={AddSupplierData}
                className="px-6 py-2 rounded-xl bg-neutral-900 text-white font-medium hover:bg-neutral-800 transition shadow-lg"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
