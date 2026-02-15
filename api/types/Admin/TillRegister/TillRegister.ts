export interface AddTill {
  tillName: string;
  listProduct: listProduct[];
}
export interface listProduct {
  attributeID: string;
  qty: number;
}

export interface RespiosneGet {
  message: string;
  tillList: TillList[];
}
export interface TillList {
  tillID: string;
  tillName: string;
  tillSubList: TillSubList[];
}
export interface TillSubList {
  varinetName: string;
  barcode: string;
  subVarientName: string;
  productName: string;
  qty: number;
  attributeID: string;
}
export interface ModifyTill {
  TillID: string;
  tillName: string;
  listProduct: listProduct[];
}
export interface listProduct {
  attributeID: string;
  qty: number;
}
