"use server";

import { postRequest } from "@/api/main/main";
import { ModifyTill } from "@/api/types/Admin/TillRegister/TillRegister";

export default async function ModifyTillForPos(
  data: ModifyTill,
  token?: string,
) {
  try {
    const customHeader: Record<string, string> = {};
    if (token) customHeader.Authorization = `Bearer ${token}`;

    const response = await postRequest(
      `/api/TillManagement/ModifyTill`,
      data,
      customHeader,
    );

    if (response.success) {
      return {
        data: response.data,
        status: response.status,
        message: response.message || "Record Modifed Successfully",
      };
    }

    return {
      data: response.data,
      status: response.status,
      message: response.message || "An unexpected error occurred",
    };
  } catch (error: any) {
    return {
      data: error.data,
      status: 500,
      message: error?.message || "Server error",
      success: false,
    };
  }
}
