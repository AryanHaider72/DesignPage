"use server";

import ErrorHandler from "@/api/ErrorHandler/ErrorHandler";
import { postRequest } from "@/api/main/main";

import {
  AddDelievryRequrest,
  ModifyDelievryRequrest,
} from "@/api/types/Admin/Shipment/Delievry/Delievry";
export default async function ModifyDelievryStandard(
  data: ModifyDelievryRequrest,
  token: string,
) {
  const customHeader: Record<string, string> = {};
  if (token) customHeader.Authorization = `Bearer ${token}`;

  const response = await postRequest(
    `/api/Shippment/admin/ModifyDelievryStandard`,
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
    message: response.message || "Record Modified Successfully",
  };
}
