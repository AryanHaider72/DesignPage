export interface RequestSubCatAddData {
  categoryID: string;
  storeID: string;
  subCategoryName: string;
  description: string;
}
export interface ResponseSubCatAddData {
  status: string;
  message?: string;
}

export interface CategorySubApiResponse {
  categoryList: CategorySub[];
}

export type CategorySub = {
  categoryID: string;
  subCategoryID: string;
  subCategoryName: string;
  description: string;
};
export interface RequestSubCatUpdateData {
  subCategoryID: string;
  storeID: string;
  categoryID: string;
  subCategoryName: string;
  description: string;
}
