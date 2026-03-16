"use server";

import ErrorHandler from "@/api/ErrorHandler/ErrorHandler";
import { getRequest } from "@/api/main/main";

export default async function DashboardOverviewStatsOffline(
  token: string,
  dateFrom: string,
  dateTo: string,
  tillID: string,
) {
  const customHeader: Record<string, string> = {};
  if (token) customHeader.Authorization = `Bearer ${token}`;

  const response = await getRequest(
    `/api/DashBoardOverview/OfflineSeller/PosSeller/OfflineSellerBoardOverview/${tillID}?dateFrom=${dateFrom}&dateTo=${dateTo}`,
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
