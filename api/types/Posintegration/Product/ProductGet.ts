export interface ProductApiResponseSalesMan {
  message: string;
  productList: Product[];
}
export interface Product {
  storeID: string;
  storeName: string;
  productID: string;
  storeSale: string;
  categoryID: string;
  subCategoryID: string;
  subCategoryDetailID: string;
  unitID: string;
  productName: string;
  description: string;
  feturedProduct: boolean;
  discount: number;
  currentStock: number;
  threshold: number;
  width: number;
  height: number;
  depth: number;
  weight: number;
  showinAllCountry: boolean;
  showinCountry: boolean;
  notShowinCountry: boolean;
  countryList: countryList[];
  images: Image[];
  varient: Variant[];
}

// Image sub-type
export type Image = {
  urlID: string;
  url: string;
};

// Variant sub-type
export interface Variant {
  productName?: string;
  varientID: string;
  variantName: string;
  varientSubList: VariantValue[];
}

export interface varinetMessage {
  message: string;
  variants: VariantbyProductID[];
}
export type VariantbyProductID = {
  varientID: string;
  productName: string;
  discount: number;
  variantName: string;
  variantValues: VariantValue[];
};

// Variant value sub-type
export interface VariantValue {
  attributeID: string;
  varientValue: string;
  costPrice: number;
  salePrice: number;
  qty: number;
  barcode: string;
}
export type countryList = {
  countryID: string;
  countryName: string;
};
