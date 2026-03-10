"use server";

import ErrorHandler from "@/api/ErrorHandler/ErrorHandler";
import { getRequest, postRequest } from "@/api/main/main";
import { InternationRequestAddShippingcharges } from "@/api/types/Admin/Shipment/International/Internation";
export default async function GetLocalShippingCharges(token: string) {
  const customHeader: Record<string, string> = {};
  if (token) customHeader.Authorization = `Bearer ${token}`;

  const response = await getRequest(
    `/api/Shippment/admin/GetShippingZoneRate`,
    null,
    customHeader,
  );

  // Success case
  if (!response.success) {
    const message = ErrorHandler(response.status);
    return {
      data: response.data,
      status: response.status,
      message: message,
    };
  }
  return {
    data: response.data,
    status: response.status,
    message: response.message || "Record Modified Successfully",
  };
}
