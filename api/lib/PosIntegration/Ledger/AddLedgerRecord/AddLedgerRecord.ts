"use server";

import ErrorHandler from "@/api/ErrorHandler/ErrorHandler";
import { postRequest } from "@/api/main/main";
import { ResponseExpenseAddData } from "@/api/types/Posintegration/Expense";
import { ledegrCustoemrAdd } from "@/api/types/Posintegration/Ledger/Ledger";

export default async function AddLedgerCustomer(
  data: ledegrCustoemrAdd,
  token: string,
) {
  const customHeader: Record<string, string> = {};
  if (token) customHeader.Authorization = `Bearer ${token}`;

  const response = await postRequest(
    `/api/sale/seller/posIntegration/AddLedegr`,
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
    message: response.message || "Record Added Successfully",
  };
}
