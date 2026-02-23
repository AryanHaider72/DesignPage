"use server";

import { getRequest } from "@/api/main/main";

export default async function GetCustomer(token: string, data?: {}) {
  const customHeader: Record<string, string> = {};
  if (token) customHeader.Authorization = `Bearer ${token}`;
  const response = await getRequest(
    `/api/Customer/seller/posIntegration/GetCustomer`,
    null,
    customHeader,
  );

  // Success case
  if (!response.success) {
    return {
      data: response.data,
      status: response.status,
      message: response.message || "Customer Retrieved successfully",
    };
  }
  return {
    data: response.data,
    status: response.status,
    message: response.message || "An unexpected error occurred",
  };
}
