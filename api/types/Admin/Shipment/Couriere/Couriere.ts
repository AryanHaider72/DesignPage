export interface AddCouriereRequrest {
  serviceName: string;
  deliveryTypeID: string;
  phoneNo: string;
  email: string;
  description: string;
  //openingBalance: number;
}
export interface ModifyCouriereRequrest {
  courierID: string;
  deliveryTypeID: string;
  serviceName: string;
  phoneNo: string;
  email: string;
  description: string;
  //openingBalance: number;
}

// export interface ModifyDelievryRequrest {
//   deliveryTypeID: string;
//   StandardName: string;
//   NumberOfDays: number;
//   Description: string;
// }
export interface ResponseCouriereGetData {
  message: string;
  courierList: CourierList[];
}
export interface CourierList {
  courierID: string;
  deliveryTypeID: string;
  typeName: string;
  serviceName: string;
  phoneNo: string;
  email: string;
  description: string;
}
