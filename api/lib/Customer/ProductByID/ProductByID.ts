"use server";
import ErrorHandler from "@/api/ErrorHandler/ErrorHandler";
import { getRequest } from "@/api/main/main";
import { ProductFetchRepsonse } from "@/api/types/Admin/SearchProduct/SearchProduct";

export default async function ProductSearchParamByID(
  ID: string,
  token?: string,
) {
  const customHeader: Record<string, string> = {};
  if (token) customHeader.Authorization = `Bearer ${token}`;

  const response = await getRequest(
    `/api/Product/Customer/GetProductByID/${ID}`,
    {},
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
    message: response.message,
    success: true,
  };
}
