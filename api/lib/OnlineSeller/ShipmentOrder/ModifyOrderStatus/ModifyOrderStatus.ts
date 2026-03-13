"use server";

import ErrorHandler from "@/api/ErrorHandler/ErrorHandler";
import { getRequest, postRequest } from "@/api/main/main";

export default async function ModifyOrderStatusOrderConfirmation(
  token: string,
  detailID: string,
) {
  const customHeader: Record<string, string> = {};
  if (token) customHeader.Authorization = `Bearer ${token}`;

  const response = await getRequest(
    `/api/OrderManagment/OnlineManager/OnlineSeller/ChangeStatusOrder/${detailID}`,
    null,
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
