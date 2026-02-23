"use server";

import { postRequest } from "@/api/main/main";

export default async function DeleteCustomer(
  data: { customerID: string },
  token: string,
) {
  const customHeader: Record<string, string> = {};
  if (token) customHeader.Authorization = `Bearer ${token}`;
  const response = await postRequest(
    `/api/Customer/seller/posIntegration/DeleteCustomer`,
    data,
    customHeader,
  );

  // Success case
  if (!response.success) {
    return {
      data: response.data,
      status: response.status,
      message: response.message,
    };
  }
  return {
    data: response.data,
    status: response.status,
    message: response.message,
  };
}
