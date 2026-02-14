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
      data: response.data,
      status: response.status,
    };
  } catch (error: any) {
    return {
      error: error?.response?.data || error.message,
      status: error?.response?.status,
    };
  }
}

export default api;
export { getRequest, postRequest };
