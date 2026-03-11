"use server";

import ErrorHandler from "@/api/ErrorHandler/ErrorHandler";
import { postRequest } from "@/api/main/main";
import { ResponseLoginData } from "@/api/types/Admin/Authentication/Login/login";
import { AddLoignOnline } from "@/api/types/OnlineSeller/CreateLogin";

export default async function LoginApiOnline(
  data: AddLoignOnline,
  token?: string,
) {
  const customHeader: Record<string, string> = {};
  if (token) customHeader.Authorization = `Bearer ${token}`;

  const response = await postRequest(
    `/api/OnlineSeller/Login`,
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
