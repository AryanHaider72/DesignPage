"use server";

import { getRequest } from "@/api/main/main";

export default async function GetExpenseListType(token: string, data?: {}) {
  const customHeader: Record<string, string> = {};
  if (token) customHeader.Authorization = `Bearer ${token}`;
  const response = await getRequest(
    `/api/GeneralExpense/seller/posIntegration/GetExpenseType`,
    null,
    customHeader,
  );

  // Success case
  if (!response.success) {
    return {
      data: response.data,
      status: response.status,
      message: response.message || "Customer  retrieved successfully",
    };
  }
  return {
    data: response.data,
    status: response.status,
    message: response.message || "An unexpected error occurred",
  };
}
