export interface RespoinsesellerOrderGetStore {
  message: string;
  storesMainList: storesMainListSeller[];
}
export interface storesMainListSeller {
  bankName: string;
  customerName: string;
  delievryCharges: number;
  email: string;
  orderDate: string;
  orderID: string;
  paymentStatus: string;
  totalAmount: number;
  phoneNo: string;
  shippingAddress: string;
  status: string;
  storesSubList: storesSubListCustomer[];
}
export interface storesSubListCustomer {
  bags: number;
  trackingID: string;
  attributeID: string;
  typeName: string;
  barcode: string;
  url: string;
  discount: number;
  orderDetailID: string;
  productName: string;
  qty: number;
  salePrice: number;
  phoneNo: string;
  shippingCharges: number;
  status: string;
  videoUrl: string;
  varientValue: string;
}
