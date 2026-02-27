"use server";

import ErrorHandler from "@/api/ErrorHandler/ErrorHandler";
import { postRequest } from "@/api/main/main";
import {
  modifyVarinetPayload,
  ResponseModifyProductData,
} from "@/api/types/Admin/Codes/Product/ModifyVarient";

export default async function ModifyProductVarinetAttribute(
  data: modifyVarinetPayload,
  attributeID: string,
  token?: string,
) {
  const customHeader: Record<string, string> = {};
  if (token) customHeader.Authorization = `Bearer ${token}`;

  const response = await postRequest(
    `api/Product/Seller/ModifyProduct/VarinetModify/${attributeID}`,
    data,
    customHeader,
  );

  // Success case
  if (!response.success) {
    const message = ErrorHandler(response.status);
    return {
      data: response.data as ResponseModifyProductData,
      status: response.status,
      message: message,
    };
  }
  return {
    data: response.data as ResponseModifyProductData,
    status: response.status,
    message: response.message || "Record Modified Successfully",
  };
}
