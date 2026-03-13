"use server";

import ErrorHandler from "@/api/ErrorHandler/ErrorHandler";
import { getRequest } from "@/api/main/main";

export default async function DashboardOverviewStats(
  token: string,
  dateFrom: string,
  dateTo: string,
) {
  const customHeader: Record<string, string> = {};
  if (token) customHeader.Authorization = `Bearer ${token}`;

  const response = await getRequest(
    `/api/DashBoardOverview/OfflineSeller/PosSeller/SellerBoardOverview?dateFrom=${dateFrom}&dateTo=${dateTo}`,
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
