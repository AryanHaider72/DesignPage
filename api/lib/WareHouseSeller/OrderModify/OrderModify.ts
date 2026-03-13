"use server";

import ErrorHandler from "@/api/ErrorHandler/ErrorHandler";
import { getRequest, postRequest } from "@/api/main/main";

export default async function WareHouseSellerOrderConfirmation(
  token: string,
  data: {
    detailID: string;
    packedBy: string;
    secrureUrl: string;
  },
) {
  const customHeader: Record<string, string> = {};
  if (token) customHeader.Authorization = `Bearer ${token}`;

  const response = await postRequest(
    `/api/OrderManagment/WareHouse/OnlineSeller/ApprovedOrderPacked`,
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
