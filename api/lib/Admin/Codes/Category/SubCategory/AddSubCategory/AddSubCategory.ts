"use server";

import ErrorHandler from "@/api/ErrorHandler/ErrorHandler";
import { postRequest } from "@/api/main/main";
import {
  RequestSubCatAddData,
  ResponseSubCatAddData,
} from "@/api/types/Admin/Codes/Category/SubCategory/SubCategory";

export default async function AddSubCategoryApi(
  data: RequestSubCatAddData,
  token: string,
) {
  const customHeader: Record<string, string> = {};
  if (token) customHeader.Authorization = `Bearer ${token}`;

  const response = await postRequest(
    `/api/Category/Sub/AddCategory`,
    data,
    customHeader,
  );

  // Success case
  if (!response.success) {
    const message = ErrorHandler(response.status);
    return {
      data: response.data as ResponseSubCatAddData,
      status: response.status,
      message: message,
    };
  }
  return {
    data: response.data as ResponseSubCatAddData,
    status: response.status,
    message: response.message || "Record Added Successfully",
  };
}
