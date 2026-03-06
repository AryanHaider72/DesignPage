export interface AddDelievryRequrest {
  StandardName: string;
  NumberOfDays: string;
  Description: string;
}

export interface ModifyDelievryRequrest {
  deliveryTypeID: string;
  StandardName: string;
  NumberOfDays: string;
  Description: string;
}
export interface ResponseDelievryGetData {
  message: string;
  delievryData: DelievryGetData[];
}
export interface DelievryGetData {
  deliveryTypeID: string;
  typeName: string;
  numberofDays: string;
  description: string;
}
