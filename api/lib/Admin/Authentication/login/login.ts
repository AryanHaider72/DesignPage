"use server";
import { postRequest } from "@/api/main/main";
import {
  RequestLoginData,
  ResponseLoginData,
} from "@/api/types/Admin/Authentication/Login/login";

export default async function AdminLoginApi(
  data: RequestLoginData,
  token?: string,
) {
  const customHeader: Record<string, string> = {};
  if (token) customHeader.Authorization = `Bearer ${token}`;

  try {
    const response = await postRequest(`/api/Seller/Login`, data, customHeader);

    // Check if it's an error response
    if (!response.success || response.error) {
      return {
        data: null,
        error: response.error || "Something went wrong",
        status: response.status || 500,
        message:
          typeof response.error === "string"
            ? response.error
            : "Something Went Wrong. Try Again Later.",
        success: false,
      };
    }

    // Success case
    return {
      data: response.data as ResponseLoginData,
      error: null,
      status: response.status,
      message: "Login Successfully",
      success: true,
    };
  } catch (error: any) {
    return {
      data: null,
      message: "Internal Server Error",
      error: error?.message || "Unknown error",
      status: 500,
      success: false,
    };
  }
}
