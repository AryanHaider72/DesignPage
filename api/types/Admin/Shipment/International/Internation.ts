export interface InternationRequestAddShippingcharges {
  shippingDetail: shippingDetail[];
}
export interface shippingDetail {
  deliveryTypeID: string;
  lessThen1KG: number;
  lessThen5KG: number;
  lessThen10KG: number;
  greaterThen10KG: number;
  CountryFromID: string;
  CountryDestinationID: string;
}

export interface responseINternationShippingRateCountry {
  message: string;
  loopList: loopList[];
}

export interface loopList {
  countryFrom: string;
  countryFromID: string;
  countryTo: string;
  countryToID: string;
  deliveryType: string;
  deliveryTypeID: string;
  lessThen1KG: number;
  lessThen5KG: number;
  lessThen10KG: number;
  greaterThen10KG: number;
}
