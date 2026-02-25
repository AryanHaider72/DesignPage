export interface RequestSubAddData {
  name: string;
  units: unitList[];
  subCategoryID: string;
}
export interface unitList {
  unitID: string;
}
export interface ResponseSubAddData {
  status: string;
  message?: string;
}
// Response Type
export interface FurtherSubApiResponse {
  categoryList: FurtherSub[];
}

// A single FurtherSub record
export type FurtherSub = {
  subCategoryID: string;
  subCategoryDetailID: string;
  name: string;
  unit: Unit[];
};

export type Unit = {
  unitID: string;
  unitName: string;
};
export interface RequestSubModifyData {
  subCategoryDetailID: string;
  name: string;
  units: { unitID: string }[];
  // subCategoryID: string;
}
export interface ResponseSubModifyData {
  status: string;
  message?: string;
}
