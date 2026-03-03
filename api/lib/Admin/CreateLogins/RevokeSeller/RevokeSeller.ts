"use server";

import ErrorHandler from "@/api/ErrorHandler/ErrorHandler";
import { postRequest } from "@/api/main/main";

export default async function SellerRevoke(
  data: { sellerID: string; isActive: boolean },
  token?: string,
) {
  const customHeader: Record<string, string> = {};
  if (token) customHeader.Authorization = `Bearer ${token}`;

  const response = await postRequest(
    `/api/Seller/SellerRevoke/${data.sellerID}/${data.isActive}`,
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
    message: "Revoke Successful",
    success: true,
  };
}
