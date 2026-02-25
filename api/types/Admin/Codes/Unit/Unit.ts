export interface RequestUnitAddData {
  unitName: string;
  storeID: string;
  abbreviation: string;
  description: string;
}
export interface ResponseUnitAddData {
  status: string;
  message?: string;
}
export interface UnitApiResponse {
  categoryList: UnitList[];
}

export type UnitList = {
  unitID: string;
  unitName: string;
  abbreviation: string;
  description: string;
};
export interface UnitIDApiResponse {
  unitsList: UnitListID[];
}

export type UnitListID = {
  unitID: string;
  unitName: string;
};
export interface RequestUnitUpdateData {
  unitID: string;
  storeID: string;
  unitName: string;
  abbreviation: string;
  description: string;
}
