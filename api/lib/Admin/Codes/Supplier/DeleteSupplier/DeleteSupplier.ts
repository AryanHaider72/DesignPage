"use server";

import ErrorHandler from "@/api/ErrorHandler/ErrorHandler";
import { postRequest } from "@/api/main/main";
import {
  RequestSupplierAddData,
  ResponseSupplierAddData,
} from "@/api/types/Admin/Codes/Supplier/Supplier";
export default async function DeleteSupplierApi(
  data: { supplierID: string },
  token: string,
) {
  const customHeader: Record<string, string> = {};
  if (token) customHeader.Authorization = `Bearer ${token}`;

  const response = await postRequest(
    `/api/Supplier/seller/posIntegration/DeleteSupplier`,
    data,
    customHeader,
  );

  // Success case
  if (!response.success) {
    const message = ErrorHandler(response.status);
    return {
      data: response.data as ResponseSupplierAddData,
      status: response.status,
      message: message,
    };
  }
  return {
    data: response.data as ResponseSupplierAddData,
    status: response.status,
    message: response.message || "Record Added Successfully",
  };
}
