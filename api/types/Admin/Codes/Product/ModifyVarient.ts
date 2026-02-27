export interface modifyVarinetPayload {
  varientValue: string;
  qty: number;
  costPrice: number;
  salePrice: number;
  barcode: string;
}
export interface ResponseModifyProductData {
  status: string;
  message?: string;
}
