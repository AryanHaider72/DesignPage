"use server";

import ErrorHandler from "@/api/ErrorHandler/ErrorHandler";
import { getRequest } from "@/api/main/main";

export default async function CustomerOrderGet(token: string) {
  const customHeader: Record<string, string> = {};
  if (token) customHeader.Authorization = `Bearer ${token}`;

  const response = await getRequest(
    `/api/OrderManagment/customer/GetOrder`,
    null,
    customHeader,
  );

  if (!response.success) {
    const message = ErrorHandler(response.status);

    return {
      data: response.data,
      status: response.status,
      message: message,
      success: false,
    };
  }
  return {
    data: response.data,
    status: response.status,
    message: response.message,
    success: true,
  };
}
