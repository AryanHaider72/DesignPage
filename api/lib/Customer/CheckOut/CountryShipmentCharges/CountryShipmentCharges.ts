"use server";

import ErrorHandler from "@/api/ErrorHandler/ErrorHandler";
import { getRequest, postRequest } from "@/api/main/main";
import { requestAddStoreToGetRate } from "@/api/types/Customer/CheckOut/ShipmentCharges/ShipmentCharges";

export default async function CountryShipmentChargesApi(
  DestinationcountryID: string,
  deliveryTypeID: string,
  data: requestAddStoreToGetRate,
  token?: string,
) {
  const customHeader: Record<string, string> = {};
  if (token) customHeader.Authorization = `Bearer ${token}`;

  const response = await postRequest(
    `/api/Shippment/admin/GetShipmentRatesCountry/${DestinationcountryID}/${deliveryTypeID}`,
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
