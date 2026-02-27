// Main API response interface
export interface ProductApiResponse {
  message: string;
  list: ProductForAdmin[];
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}
export interface ProductApiResponseSalesMan {
  message: string;
  productList: ProductForAdmin[];
}

// A single product record
export interface ProductForAdmin {
  storeID: string;
  storeName: string;
  productID: string;
  supplierID: string;
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
  variants: Variant[];
}

// Image sub-type
export type Image = {
  urlID: string;
  url: string;
};

// Variant sub-type
export type Variant = {
  varientID: string;
  variantName: string;
  variantValues: VariantValue[];
};
export type VariantValue = {
  attributeID: string;
  varientValue: string;
  costPrice: number;
  salePrice: number;
  qty: number;
  barcode: string;
};

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
export type countryList = {
  countryID: string;
  countryName: string;
};
