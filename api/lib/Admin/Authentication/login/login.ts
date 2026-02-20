"use server";
import ErrorHandler from "@/api/ErrorHandler/ErrorHandler";
import { postRequest } from "@/api/main/main";
import {
  RequestLoginData,
  ResponseLoginData,
} from "@/api/types/Admin/Authentication/Login/login";

// Define the response type
interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string | boolean | { message?: string } | any;
  message?: string;
  status?: number;
}

export default async function AdminLoginApi(
  data: RequestLoginData,
  token?: string,
) {
  const customHeader: Record<string, string> = {};
  if (token) customHeader.Authorization = `Bearer ${token}`;

  try {
    const response = (await postRequest(
      `/api/Seller/Login`,
      data,
      customHeader,
    )) as ApiResponse;

    // Check if it's an error response
    if (!response.success || response.error) {
      // Safely extract error message
      let errorText = "Something went wrong";

      // Handle different types of error
      if (typeof response.error === "string") {
        errorText = response.error;
      } else if (
        response.error &&
        typeof response.error === "object" &&
        "message" in response.error
      ) {
        errorText = response.error.message as string;
      } else if (typeof response.message === "string") {
        errorText = response.message;
      } else if (response.error === true) {
        // If error is just boolean true, use default message
        errorText = "An error occurred";
      }

      // Create error object for ErrorHandler
      const error = new Error(errorText);
      (error as any).status = response.status || 500;
      (error as any).response = {
        data: { message: errorText },
        status: response.status || 500,
      };

      const errorMessage = await ErrorHandler(error);

      return {
        data: null,
        error: errorText,
        status: response.status || 500,
        message: errorMessage,
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
    const errorMessage = await ErrorHandler(error);

    return {
      data: null,
      message: errorMessage,
      error: error?.message || "Unknown error",
      status: error?.response?.status || 500,
      success: false,
    };
  }
}
