export interface requestAddStoreToGetRate {
  storeList: stores[];
}
export interface stores {
  storeID: string;
}
export interface shiipingInformation {
  message: string;
  informationList: informationList[];
}
export interface informationList {
  destinationZoneID: string;
  greaterThen10KG: number;
  lessThen1KG: number;
  lessThen5KG: number;
  storeID: string;
  storeName: string;
  storeZoneID: string;
}
