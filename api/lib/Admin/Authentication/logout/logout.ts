"use server";

import ErrorHandler from "@/api/ErrorHandler/ErrorHandler";
import { getRequest, postRequest } from "@/api/main/main";
import {
  RequestLoginData,
  ResponseLoginData,
} from "@/api/types/Admin/Authentication/Login/login";

export default async function LogoutApi(token: string) {
  const customHeader: Record<string, string> = {};
  if (token) customHeader.Authorization = `Bearer ${token}`;

  const response = await getRequest(
    `/api/loginAndAuth/Logout`,
    null,
    customHeader,
  );

  if (!response.success) {
    const message = ErrorHandler(response.status);

    return {
      data: response.data,
      status: response.status,
      message: message,
      success: false,
    };
  }

  return {
    data: response.data,
    status: response.status,
    message: "Login Successful",
    success: true,
  };
}
