export interface ProductApiResponseCustomer {
  message: string;
  productList: FeaturedProductForCustomer[];
}

// A single product record
export interface FeaturedProductForCustomer {
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
  images: FeaturedImage[];
  variants: FeaturedVariant[];
}

// Image sub-type
export type FeaturedImage = {
  urlID: string;
  url: string;
};

// Variant sub-type
export type FeaturedVariant = {
  varientID: string;
  variantName: string;
  variantValues: FeaturedVariantValue[];
};
export type FeaturedVariantValue = {
  attributeID: string;
  varientValue: string;
  costPrice: number;
  salePrice: number;
  qty: number;
  barcode: string;
};
