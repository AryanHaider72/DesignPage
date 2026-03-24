"use server";

import ErrorHandler from "@/api/ErrorHandler/ErrorHandler";
import { getRequest } from "@/api/main/main";

export default async function GetInitalStoreSalesMan(token: string) {
  const customHeaders: Record<string, string> = {};
  if (token) customHeaders.Authorization = `Bearer ${token}`;
  const response = await getRequest(
    `/api/Stores/SalesMan/GetInitalStore`,
    null,
    customHeaders,
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
    message: "Authorized User",
    success: true,
  };
}
