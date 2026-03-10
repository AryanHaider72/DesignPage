export interface requestOrderData {
  customerName: string;
  phoneNo: string;
  shippingAddress: string;
  email: string;
  city: string;
  country: string;
  postalCode: string;
  orderMainList: orderMainList[];
}
export interface orderMainList {
  orderDate: string;
  paymentID: string;
  paymentStatus: string;
  delievryCharges: number;
  shippingAddress: string;
  couponDiscount: number;
  totalBill: number;
  couponNumber: string;
  orderListSub: orderListSub[];
}
export interface orderListSub {
  attributeID: string;
  qty: number;
  orignalPrice: number;
  salePrice: number;
  discount: number;
  shippingCharges: number;
}
