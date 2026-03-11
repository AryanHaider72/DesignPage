"use server";

import ErrorHandler from "@/api/ErrorHandler/ErrorHandler";
import { getRequest, postRequest } from "@/api/main/main";

export default async function SellerOrderConfirmation(
  token: string,
  orderDetailID: string,
  data: { bags: number; status: string },
) {
  const customHeader: Record<string, string> = {};
  if (token) customHeader.Authorization = `Bearer ${token}`;

  const response = await postRequest(
    `/api/OrderManagment/seller/OrderConfiramtion/${orderDetailID}`,
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
    message: response.message,
    success: true,
  };
}
