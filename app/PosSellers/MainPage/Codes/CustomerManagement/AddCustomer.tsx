import AddCustomerApi from "@/api/lib/PosIntegration/Customer/AddCustomer/AddCustomer";
import ModifyCustomerApi from "@/api/lib/PosIntegration/Customer/ModifyCustomer/ModifyCustomer";
import { CustomerData } from "@/api/types/Posintegration/Customer";
import { useEffect, useState } from "react";

interface AddExpenseProps {
  initialData?: CustomerData | null;
  Update: boolean;
  onShowMessage: (message: any, type: "success" | "error") => void;
}

export default function AddCustomer({
  initialData,
  Update,
  onShowMessage,
}: AddExpenseProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [CustomerName, setCustomerName] = useState("");
  const [PhoneNo, setPhoneNo] = useState("");
  const [Email, setEmail] = useState("");
  const [Address, setAddress] = useState("");
  const [OpeningBalance, setOpeningBalance] = useState("");
  const [Description, setDescription] = useState("");
  const [CustomerID, setCustomerID] = useState("");

  const addCustomer = async () => {
    const token = localStorage.getItem("posSellerToken");
    try {
      setIsLoading(true);
      const formData = {
        customerName: CustomerName,
        phoneNo: PhoneNo,
        email: Email,
        description: Description,
        openingBalance: Number(OpeningBalance),
        address: Address,
      };
      const response = await AddCustomerApi(formData, String(token));
      if (response.status === 200 || response.status === 201) {
        setCustomerName("");
        setPhoneNo("");
        setDescription("");
        setEmail("");
        setOpeningBalance("");
        setAddress("");
        onShowMessage(
          response.message || "Customer Added successfully",
          "success",
        );
      } else {
        onShowMessage(response.message, "error");
      }
    } catch (error: unknown) {
      onShowMessage(error, "error");
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };
  const ModifyCustomer = async () => {
    const token = localStorage.getItem("posSellerToken");
    try {
      setIsLoading(true);
      const formData = {
        customerID: CustomerID,
        customerName: CustomerName,
        phoneNo: PhoneNo,
        email: Email,
        description: Description,
        openingBalance: Number(OpeningBalance),
        address: Address,
      };
      const response = await ModifyCustomerApi(formData, String(token));
      if (response.status === 200 || response.status === 201) {
        setCustomerName("");
        setPhoneNo("");
        setCustomerID("");
        setDescription("");
        setEmail("");
        setOpeningBalance("");
        setAddress("");
        onShowMessage(
          response.message || "Customer Added successfully",
          "success",
        );
      } else {
        onShowMessage(response.message, "error");
      }
    } catch (error: unknown) {
      onShowMessage(error, "error");
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (initialData) {
      console.log(initialData);
      setCustomerID(initialData.customerID);
      setCustomerName(initialData.customerName);
      setDescription(initialData.description);
      setEmail(initialData.email);
      setPhoneNo(initialData.phoneNo);
      setAddress(initialData.address);
      setOpeningBalance(String(initialData.remainingBalance));
    }
  }, [initialData]);

  return (
    <>
      <div className="w-full flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:max-w-md space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Customer Name
            </label>
            <input
              type="text"
              value={CustomerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none transition"
              placeholder="Customer Name"
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
              className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none transition"
              placeholder="Email"
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
              className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none transition"
              placeholder="Address"
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
              className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none transition"
              placeholder="Phone No"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Opening Balance
            </label>
            <input
              type="number"
              value={OpeningBalance}
              onChange={(e) => setOpeningBalance(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none transition"
              placeholder="Opening Balance"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Description
            </label>
            <textarea
              value={Description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none transition"
              placeholder="Description"
            />
          </div>
          {Update ? (
            <div className="flex justify-end">
              <button
                onClick={ModifyCustomer}
                className="px-6 py-2 rounded-xl bg-neutral-900 text-white font-medium hover:bg-neutral-800 transition shadow-lg"
              >
                {isLoading ? "Updating..." : "Update"}
              </button>
            </div>
          ) : (
            <div className="flex justify-end">
              <button
                onClick={addCustomer}
                className="px-6 py-2 rounded-xl bg-neutral-900 text-white font-medium hover:bg-neutral-800 transition shadow-lg"
              >
                {isLoading ? "Saving..." : "Save"}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
