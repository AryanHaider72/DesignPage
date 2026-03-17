export interface responseGetSale {
  message: string;
  saleList: Sale[];
}

export interface Sale {
  saleID: string;
  invoiceNo: number;
  customerName: string;
  saleDate: string;
  totalBill: number;
  amountPaid: number;
  adjustment: number;
  remarks: string;
  email: string;
  address: string;
  phoneNo: string;
  itemList: SaleItem[];
}
export interface SaleItem {
  barcode: string;
  attributeID: string;
  productName: string;
  varinet: string;
  qty: number;
  price: number;
  remarks: string;
  storeName: string;
  email: string;
  address: string;
  phone: string;
}

export interface requestAddSale {
  customerID: string;
  postingDate: string;
  totalBill: number;
  amountPaid: number;
  adjustment: number;
  remarks: string;
  SalesmanID: string;
  list: ListItem[];
}
export interface ListItem {
  attributeID: string;
  qty: number;
  amount: number;
  remakrs: string;
}
export interface responseAddSale {
  message: string;
}
