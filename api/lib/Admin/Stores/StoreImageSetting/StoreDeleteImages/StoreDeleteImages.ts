"use server";
import ErrorHandler from "@/api/ErrorHandler/ErrorHandler";
import { postRequest } from "@/api/main/main";

export default async function StoreHomePageSettingDeleteImage(
  imageID: string,
  token: string,
  data?: {},
) {
  const customHeader: Record<string, string> = {};
  if (token) customHeader.Authorization = `Bearer ${token}`;

  const response = await postRequest(
    `/api/Stores/Seller/HomePageSetting/DeleteStoreImagesSetting/${imageID}`,
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
    message: "Image Deleted Successful",
    success: true,
  };
}
