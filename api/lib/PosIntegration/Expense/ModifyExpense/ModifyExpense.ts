"use server";

import ErrorHandler from "@/api/ErrorHandler/ErrorHandler";
import { postRequest } from "@/api/main/main";
import {
  RequestExpenseModifyData,
  ResponseExpenseAddData,
} from "@/api/types/Posintegration/Expense";

export default async function ModifyExpenseApi(
  data: RequestExpenseModifyData,
  token: string,
) {
  const customHeader: Record<string, string> = {};
  if (token) customHeader.Authorization = `Bearer ${token}`;

  const response = await postRequest(
    `/api/GeneralExpense/seller/posIntegration/ModifyExpense`,
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
    message: response.message || "Record Modifed Successfully",
  };
}
