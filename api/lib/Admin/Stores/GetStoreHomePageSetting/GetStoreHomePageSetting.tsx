"use server";

import ErrorHandler from "@/api/ErrorHandler/ErrorHandler";
import { getRequest } from "@/api/main/main";

export default async function StoreHomePageGetSetting(
  storeID: string,
  token: string,
  data?: {},
) {
  const customHeader: Record<string, string> = {};
  if (token) customHeader.Authorization = `Bearer ${token}`;
  const response = await getRequest(
    `/api/Stores/Seller/HomePageSetting/GetStoreSetting/${storeID}`,
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
    message: response.message,
  };
}
