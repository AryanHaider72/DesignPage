export interface LocalRequestAddShippingcharges {
  shippingDetail: shippingDetailZone[];
}
export interface shippingDetailZone {
  deliveryTypeID: string;
  lessThen1KG: number;
  lessThen5KG: number;
  lessThen10KG: number;
  greaterThen10KG: number;
  storeZoneID: string;
  destinationZoneID: string;
}

export interface responseINternationShippingRateZone {
  message: string;
  loopList: loopListZone[];
}
export interface loopListZone {
  fromZoneID: string;
  fromZoneName: string;
  toZoneID: string;
  toZoneName: string;
  deliveryType: string;
  deliveryTypeID: string;
  lessThen1KG: number;
  lessThen5KG: number;
  lessThen10KG: number;
  greaterThen10KG: number;
}
