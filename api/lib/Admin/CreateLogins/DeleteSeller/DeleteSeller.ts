"use server";

import ErrorHandler from "@/api/ErrorHandler/ErrorHandler";
import { postRequest } from "@/api/main/main";
export default async function SellerDelete(
  data: { sellerID: string },
  token?: string,
) {
  const customHeader: Record<string, string> = {};
  if (token) customHeader.Authorization = `Bearer ${token}`;

  const response = await postRequest(
    `/api/Seller/SellerDelete/${data.sellerID}`,
    data,
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
    message: "Login Successful",
    success: true,
  };
}
