"use server";
import ErrorHandler from "@/api/ErrorHandler/ErrorHandler";
import { postRequest } from "@/api/main/main";
import {
  RequestStoreHomepageData,
  RequestStoreHomepageUpdateDataImage,
  ResponseStoreHomePageData,
} from "@/api/types/Admin/Store/StoreHomepageSetting/StoreHomepageSetting";

export default async function StoreHomePageUpdateSettingImage(
  data: RequestStoreHomepageUpdateDataImage,
  userID: string,
  token: string,
) {
  const customHeader: Record<string, string> = {};
  if (token) customHeader.Authorization = `Bearer ${token}`;

  const response = await postRequest(
    `/api/Stores/Seller/HomePageSetting/UpdateStoreSettingImage/${userID}`,
    data,
    customHeader,
  );

  if (!response.success) {
    const message = ErrorHandler(response.status);

    return {
      data: response.data as ResponseStoreHomePageData,
      status: response.status,
      message: message,
      success: false,
    };
  }

  return {
    data: response.data as ResponseStoreHomePageData,
    status: response.status,
    message: "Sotre Modified Successful",
    success: true,
  };
}
