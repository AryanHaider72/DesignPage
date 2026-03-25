"use server";
import { getRequest } from "@/api/main/main";
import { ProductFetchRepsonse } from "@/api/types/Admin/SearchProduct/SearchProduct";

export default async function ProductSearchParamCustomer(
  word: string,
  token?: string,
) {
  const customHeader: Record<string, string> = {};
  if (token) customHeader.Authorization = `Bearer ${token}`;

  try {
    const customHeader: Record<string, string> = {};
    if (token) customHeader.Authorization = `Bearer ${token}`;

    const response = await getRequest(
      `/api/Product/Customer/SearchGetProduct/${word}`,
      {},
      customHeader,
    );

    if (response.success) {
      return {
        data: response.data as ProductFetchRepsonse,
      };
    }

    return {
      data: response.data as ProductFetchRepsonse,
    };
  } catch (error: any) {
    return {
      data: error.data as ProductFetchRepsonse,
    };
  }
}
