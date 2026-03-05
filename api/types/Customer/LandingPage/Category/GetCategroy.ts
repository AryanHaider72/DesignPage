export interface GetCategoryResponse {
  message: string;
  categoryList: categoryList[];
}
export interface categoryList {
  subCategory: subCategory[];
  subCategoryID: string;
  subCategoryName: string;
}
export interface subCategory {
  imagelist: imagelist[];
  name: string;
  subCategoryDetailID: string;
}
export interface imagelist {
  url: string;
}
