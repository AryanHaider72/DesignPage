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
    const customHeader: Record<string, string> = {};
    if (token) customHeader.Authorization = `Bearer ${token}`;

    const response = await postRequest(`/api/Seller/Login`, data, customHeader);

    if (response.success) {
      return {
        data: response.data as ResponseLoginData,
      };
    }

    return {
      data: response.data as ResponseLoginData,
    };
  } catch (error: any) {
    return {
      data: error.data,
    };
  }
}
