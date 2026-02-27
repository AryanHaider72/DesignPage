"use server";

import ErrorHandler from "@/api/ErrorHandler/ErrorHandler";
import { postRequest } from "@/api/main/main";
import {
  ProductAddRequest,
  ResponseAddProductData,
} from "@/api/types/Admin/Codes/Product/Product";

export default async function AddProduct(
  data: ProductAddRequest,
  token?: string,
) {
  const customHeader: Record<string, string> = {};
  if (token) customHeader.Authorization = `Bearer ${token}`;

  const response = await postRequest(
    `/api/Product/Seller/AddProduct`,
    data,
    customHeader,
  );

  // Success case
  if (!response.success) {
    const message = ErrorHandler(response.status);
    return {
      data: response.data as ResponseAddProductData,
      status: response.status,
      message: message,
    };
  }
  return {
    data: response.data as ResponseAddProductData,
    status: response.status,
    message: response.message || "Record Added Successfully",
  };
}
