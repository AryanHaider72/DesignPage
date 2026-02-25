"use server";

import ErrorHandler from "@/api/ErrorHandler/ErrorHandler";
import { postRequest } from "@/api/main/main";

import {
  RequestSubAddData,
  ResponseSubAddData,
} from "@/api/types/Admin/Codes/Category/SubCategoryMore/SubCategoryMore";

export default async function AddSubCategoryMoreApi(
  data: RequestSubAddData,
  token: string,
) {
  const customHeader: Record<string, string> = {};
  if (token) customHeader.Authorization = `Bearer ${token}`;

  const response = await postRequest(
    `/api/Category/Sub/FurtherSub/AddCategory`,
    data,
    customHeader,
  );

  // Success case
  if (!response.success) {
    const message = ErrorHandler(response.status);
    return {
      data: response.data as ResponseSubAddData,
      status: response.status,
      message: message,
    };
  }
  return {
    data: response.data as ResponseSubAddData,
    status: response.status,
    message: response.message || "Record Added Successfully",
  };
}
