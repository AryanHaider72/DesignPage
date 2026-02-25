"use server";

import ErrorHandler from "@/api/ErrorHandler/ErrorHandler";
import { postRequest } from "@/api/main/main";

import {
  RequestUnitUpdateData,
  ResponseUnitAddData,
} from "@/api/types/Admin/Codes/Unit/Unit";
export default async function ModifyUnitApi(
  data: RequestUnitUpdateData,
  token: string,
) {
  const customHeader: Record<string, string> = {};
  if (token) customHeader.Authorization = `Bearer ${token}`;

  const response = await postRequest(
    `/api/Category/Units/ModifyUnit`,
    data,
    customHeader,
  );

  // Success case
  if (!response.success) {
    const message = ErrorHandler(response.status);
    return {
      data: response.data as ResponseUnitAddData,
      status: response.status,
      message: message,
    };
  }
  return {
    data: response.data as ResponseUnitAddData,
    status: response.status,
    message: response.message || "Record Added Successfully",
  };
}
