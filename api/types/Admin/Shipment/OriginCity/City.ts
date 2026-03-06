export interface requestAddCityOrigin {
  cityName: string;
  zoneID: string;
}
export interface requestModifyCityOrigin {
  cityID: string;
  cityName: string;
  zoneID: string;
}

export interface responseCityOrigin {
  message: string;
  zonelist: zonelistOrigin[];
}
export interface zonelistOrigin {
  cityID: string;
  cityName: string;
  zoneID: string;
  zoneName: string;
  regionID: string;
  regionName: string;
  countryID: string;
  countryName: string;
}
