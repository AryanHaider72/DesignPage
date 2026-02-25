"use server";

import ErrorHandler from "@/api/ErrorHandler/ErrorHandler";
import { postRequest } from "@/api/main/main";
import { RequestSubCatUpdateData } from "@/api/types/Admin/Codes/Category/SubCategory/SubCategory";
import { ResponseSupplierAddData } from "@/api/types/Admin/Codes/Supplier/Supplier";
export default async function ModifyCatgeroySubApi(
  data: RequestSubCatUpdateData,
  token: string,
) {
  const customHeader: Record<string, string> = {};
  if (token) customHeader.Authorization = `Bearer ${token}`;

  const response = await postRequest(
    `/api/Category/Sub/ModifyCategory`,
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
