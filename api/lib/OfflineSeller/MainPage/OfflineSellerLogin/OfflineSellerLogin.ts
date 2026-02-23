"use server";

import ErrorHandler from "@/api/ErrorHandler/ErrorHandler";
import { postRequest } from "@/api/main/main";
import {
  RequestLoginData,
  ResponseLoginData,
} from "@/api/types/Admin/Authentication/Login/login";

export default async function LoginOfflineSeller(
  data: RequestLoginData,
  token?: string,
) {
  const customHeader: Record<string, string> = {};
  if (token) customHeader.Authorization = `Bearer ${token}`;

  const response = await postRequest(
    `/api/TillManagement/login`,
    data,
    customHeader,
  );

  if (!response.success) {
    const message = ErrorHandler(response.status);

    return {
      data: response.data as ResponseLoginData,
      status: response.status,
      message: message,
      success: false,
    };
  }
  return {
    data: response.data as ResponseLoginData,
    status: response.status,
    message: "Login Successful",
    success: true,
  };
}
