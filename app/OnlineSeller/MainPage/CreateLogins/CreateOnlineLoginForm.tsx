"use client";
import AddLoginForWareHouseSeller from "@/api/lib/OnlineSeller/CreateLogin/CreateLogin";
import { useState } from "react";
interface AddTillFormProps {
  // Update: boolean;
  // TillID: string;
  onShowMessage: (message: string, type: "success" | "error") => void;
  //initialData?: TillList | null;
}
export default function CreateOnlineLoginForm({
  onShowMessage,
}: AddTillFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const CreateLogin = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("OnlineSellerToken");
      const formData = {
        email: Email,
        password: Password,
      };
      const response = await AddLoginForWareHouseSeller(
        formData,
        String(token),
      );
      if (response.status === 200) {
        onShowMessage(
          response.message || "Login Created successfully",
          "success",
        );
        setEmail("");
        setPassword("");
        // setIsTrue(false);
        // setResponseBack("Record Added Successfully");
      } else {
        onShowMessage(response.message || "Something went wrong", "error");
      }
    } catch (err) {
      onShowMessage("Network error. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <div className="w-full flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:max-w-md space-y-4">
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
              Password
            </label>
            <input
              type="text"
              value={Password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-neutral-200 shadow-sm focus:ring-2 focus:ring-neutral-900 focus:outline-none transition"
              placeholder="Password"
            />
          </div>
          <div className="flex justify-end">
            <button
              onClick={CreateLogin}
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
