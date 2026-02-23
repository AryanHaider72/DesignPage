"use server";

import { getRequest } from "@/api/main/main";

export default async function DeleteExpense(expenseID: string, token: string) {
  const customHeader: Record<string, string> = {};
  if (token) customHeader.Authorization = `Bearer ${token}`;
  const response = await getRequest(
    `/api/GeneralExpense/seller/posIntegration/DeleteExpense/${expenseID}`,
    null,
    customHeader,
  );

  // Success case
  if (!response.success) {
    return {
      data: response.data,
      status: response.status,
      message: response.message,
    };
  }
  return {
    data: response.data,
    status: response.status,
    message: response.message,
  };
}
