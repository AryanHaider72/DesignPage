export interface AddDelievryRequrest {
  StandardName: string;
  NumberOfDays: number;
  Description: string;
}

export interface ModifyDelievryRequrest {
  deliveryTypeID: string;
  StandardName: string;
  NumberOfDays: number;
  Description: string;
}
export interface ResponseDelievryGetData {
  message: string;
  delievryData: DelievryGetData[];
}
export interface DelievryGetData {
  deliveryTypeID: string;
  typeName: string;
  numberofDays: number;
  description: string;
}
