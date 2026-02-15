import axios from "axios";
import { ApiResponse } from "../types/Main/apiResponse/apiResponse";

const api = axios.create({
  baseURL: process.env.BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

async function getRequest<T>(
  url: string,
  params?: any,
  headers?: Record<string, string>,
): Promise<ApiResponse<T>> {
  try {
    const response = await api.get<T>(url, {
      params,
      headers: {
        ...headers,
      },
    });
    return {
      success: true,
      data: response.data,
      status: response.status,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error?.response?.data || error.message,
      status: error?.response?.status,
    };
  }
}

async function postRequest<T>(
  url: string,
  data: any,
  headers?: Record<string, string>,
): Promise<ApiResponse<T>> {
  try {
    const response = await api.post<T>(url, data, { headers });
    return {
      success: true,
      data: response.data,
      status: response.status,
      // error is omitted (undefined) for success case
    };
  } catch (error: any) {
    // Check if the error has a response (HTTP error)
    if (error.response) {
      return {
        success: false,
        error:
          error.response.data?.message || error.response.data || error.message,
        status: error.response.status,
        // data is omitted (undefined) for error case
      };
    }
    // Network error or other issues
    return {
      success: false,
      error: error.message || "Network error",
      status: 500,
    };
  }
}

export default api;
export { getRequest, postRequest };
