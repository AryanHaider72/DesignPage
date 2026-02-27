"use server";

import ErrorHandler from "@/api/ErrorHandler/ErrorHandler";
import { getRequest, postRequest } from "@/api/main/main";

export default async function GetProductApi(
  token: string,
  storeID: string,
  pageNumber: number = 1,
) {
  const customHeader: Record<string, string> = {};
  if (token) customHeader.Authorization = `Bearer ${token}`;
  const response = await getRequest(
    `/api/Product/Seller/GetProduct/${storeID}?pageNumber=${pageNumber}`,
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
