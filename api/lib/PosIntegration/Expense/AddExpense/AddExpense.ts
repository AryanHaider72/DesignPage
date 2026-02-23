"use server";

import ErrorHandler from "@/api/ErrorHandler/ErrorHandler";
import { postRequest } from "@/api/main/main";
import {
  RequestExpenseAddData,
  ResponseExpenseAddData,
} from "@/api/types/Posintegration/Expense";

export default async function AddExpense(
  data: RequestExpenseAddData,
  token: string,
) {
  const customHeader: Record<string, string> = {};
  if (token) customHeader.Authorization = `Bearer ${token}`;

  const response = await postRequest(
    `/api/GeneralExpense/seller/posIntegration/AddExpense`,
    data,
    customHeader,
  );

  // Success case
  if (!response.success) {
    const message = ErrorHandler(response.status);
    return {
      data: response.data as ResponseExpenseAddData,
      status: response.status,
      message: message,
    };
  }
  return {
    data: response.data as ResponseExpenseAddData,
    status: response.status,
    message: response.message || "Record Added Successfully",
  };
}
