"use server";

import ErrorHandler from "@/api/ErrorHandler/ErrorHandler";
import { postRequest } from "@/api/main/main";
import { ImageApiRequest } from "@/api/types/Admin/Codes/Product/ModifyImages";

export default async function AddImageProduct(
  data: ImageApiRequest,
  token?: string,
  productID?: string,
) {
  const customHeader: Record<string, string> = {};
  if (token) customHeader.Authorization = `Bearer ${token}`;
  const response = await postRequest(
    `/api/Product/Seller/ModifyProduct/ImagesAdd/${productID}`,
    data,
    customHeader,
  );

  // Success case
  if (!response.success) {
    const message = ErrorHandler(response.status);
    return {
      data: response.data,
      status: response.status,
      message: message,
    };
  }
  return {
    data: response.data,
    status: response.status,
    message: response.message,
  };
}
