interface responseList {
  message: string;
  showHistory: historyData[];
}

interface historyData {
  customerID: string;
  customerName: string;
  saleID: string;
  productID: string;
  productName: string;
  attributeID: string;
  saleDate: string;
  varientValue: string;
  barcode: string;
  qty: number;
  salePrice: number;
  maxQty: number;
}

interface Salesman {
  salesmanID: string;
  salesmanName: string;
}
interface SalesmanApiResponse {
  salesmanList: Salesman[];
  message?: string;
}
