export interface responseGetSale {
  message: string;
  saleList: Sale[];
}

export interface Sale {
  saleID: string;
  invoiceNo: number;
  customer: string;
  saleDate: string;
  totalBill: number;
  amountPaid: number;
  adjustment: number;
  remarks: string;
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
}
