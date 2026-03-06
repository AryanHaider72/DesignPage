"use server";

import ErrorHandler from "@/api/ErrorHandler/ErrorHandler";
import { postRequest } from "@/api/main/main";
import { AddCouriereRequrest } from "@/api/types/Admin/Shipment/Couriere/Couriere";
import { requestAddCityOrigin } from "@/api/types/Admin/Shipment/OriginCity/City";

export default async function AddCityOriginApi(
  data: requestAddCityOrigin,
  token: string,
) {
  const customHeader: Record<string, string> = {};
  if (token) customHeader.Authorization = `Bearer ${token}`;

  const response = await postRequest(
    `/api/Shippment/admin/AddShippingZone`,
    data,
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
    message: response.message || "Record Added Successfully",
  };
}
