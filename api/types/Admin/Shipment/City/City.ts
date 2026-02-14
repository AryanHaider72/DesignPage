export interface RequestModifyZone {
  regionID: string;
  zoneID: string;
  zoneName: string;
}

export interface responseCityList {
  message: string;
  citylist: citylist[];
}
export interface citylist {
  cityID: string;
  cityName: string;
}
export interface responseZoneList {
  message: string;
  zonelist: zonelist[];
}
export interface zonelist {
  regionID: string;
  zoneID: string;
  zoneName: string;
  countryName: string;
  countryID: string;
  regionName: string;
}
