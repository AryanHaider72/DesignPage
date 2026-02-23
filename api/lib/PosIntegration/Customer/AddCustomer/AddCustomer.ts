"use server";

import ErrorHandler from "@/api/ErrorHandler/ErrorHandler";
import { postRequest } from "@/api/main/main";
import {
  RequestCustomerAddData,
  ResponseCustomerAddData,
} from "@/api/types/Posintegration/Customer";

export default async function AddCustomerApi(
  data: RequestCustomerAddData,
  token: string,
) {
  const customHeader: Record<string, string> = {};
  if (token) customHeader.Authorization = `Bearer ${token}`;

  const response = await postRequest(
    `/api/Customer/seller/posIntegration/AddCustomer`,
    data,
    customHeader,
  );

  // Success case
  if (!response.success) {
    const message = ErrorHandler(response.status);
    return {
      data: response.data as ResponseCustomerAddData,
      status: response.status,
      message: message,
    };
  }
  return {
    data: response.data as ResponseCustomerAddData,
    status: response.status,
    message: response.message || "Record Added Successfully",
  };
}
